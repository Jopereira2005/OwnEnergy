using DeviceService.Application.Common.Services.Interfaces;
using DeviceService.Application.Features.DeviceAction.Commands;
using DeviceService.Domain.Enums;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Entity = DeviceService.Domain.Entities;

namespace DeviceService.Application.Features.DeviceAction.Handlers.CommandHandlers;

public class ControlGroupCommandHandler(
    IDeviceService deviceService,
    IDeviceActionService deviceActionService,
    IHttpContextAccessor httpContextAccessor,
    IValidator<ControlGroupCommand> validator
) : IRequestHandler<ControlGroupCommand>
{
    private readonly IDeviceService _deviceService = deviceService;
    private readonly IDeviceActionService _deviceActionService = deviceActionService;
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
    private readonly IValidator<ControlGroupCommand> _validator = validator;

    public async Task<Unit> Handle(ControlGroupCommand request, CancellationToken cancellationToken)
    {
        await _validator.ValidateAndThrowAsync(request, cancellationToken);

        var userIdStr =
            _httpContextAccessor.HttpContext?.Items["UserId"]?.ToString()
            ?? throw new UnauthorizedAccessException("Usuário não autenticado.");

        var userId = Guid.Parse(userIdStr);

        var devices = await _deviceService.GetUserDevicesByGroupIdAsync(
            userId,
            request.GroupId,
            pageNumber: 1,
            pageSize: 30,
            cancellationToken
        );

        var actionsToLog = new List<Entity.DeviceAction>();
        var now = DateTime.UtcNow;

        foreach (var device in devices)
        {
            if (device.UserId != userId)
                throw new UnauthorizedAccessException(
                    $"O dispositivo de id {device.Id} não pertence ao usuário."
                );

            // Atualiza brilho (sem mexer no log)
            if (device.IsDimmable == false)
                device.Brightness = null;
            else
                device.Brightness = request.Status == DeviceStatus.On ? 100 : 0;

            // Aplica lógica de energia (sem alterar log)
            if (request.Status == DeviceStatus.On)
                device.HandleTurnOn(now);
            else
                device.HandleTurnOff(now);

            // Persiste estado energético do dispositivo
            await _deviceService.UpdateDeviceAsync(device, cancellationToken);

            // Mantém log simples como você queria
            actionsToLog.Add(
                new Entity.DeviceAction
                {
                    DeviceId = device.Id,
                    UserId = userId,
                    Action =
                        request.Status == DeviceStatus.On
                            ? DeviceActions.TurnOn
                            : DeviceActions.TurnOff,
                    Status = ActionStatus.Success,
                }
            );
        }

        // Atualiza o status dos dispositivos no banco
        await _deviceService.ControlUserDevicesByGroupIdAsync(
            userId,
            request.GroupId,
            request.Status,
            cancellationToken
        );

        // Loga as ações (forma original mantida)
        await _deviceActionService.LogDeviceActionsAsync(actionsToLog, cancellationToken);

        return Unit.Value;
    }
}
