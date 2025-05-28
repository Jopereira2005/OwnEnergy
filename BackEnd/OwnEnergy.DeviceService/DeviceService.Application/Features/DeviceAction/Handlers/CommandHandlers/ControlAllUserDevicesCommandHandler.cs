using DeviceService.Application.Common.Services.Interfaces;
using DeviceService.Application.Features.DeviceAction.Commands;
using DeviceService.Domain.Enums;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Entity = DeviceService.Domain.Entities;

namespace DeviceService.Application.Features.DeviceAction.Handlers.CommandHandlers;

public class ControlAllUserDevicesCommandHandler(
    IDeviceService deviceService,
    IDeviceActionService deviceActionService,
    IDeviceSnapshotService snapshotService,
    IHttpContextAccessor httpContextAccessor,
    IValidator<ControlAllUserDevicesCommand> validator
) : IRequestHandler<ControlAllUserDevicesCommand>
{
    private readonly IDeviceService _deviceService = deviceService;
    private readonly IDeviceActionService _deviceActionService = deviceActionService;
    private readonly IDeviceSnapshotService _snapshotService = snapshotService;
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
    private readonly IValidator<ControlAllUserDevicesCommand> _validator = validator;

    public async Task<Unit> Handle(
        ControlAllUserDevicesCommand request,
        CancellationToken cancellationToken
    )
    {
        await _validator.ValidateAndThrowAsync(request, cancellationToken);

        var userIdStr =
            _httpContextAccessor.HttpContext?.Items["UserId"]?.ToString()
            ?? throw new UnauthorizedAccessException("Usuário não autenticado.");

        var userId = Guid.Parse(userIdStr);

        var now = DateTime.UtcNow;

        // 🔥 Gera snapshot do usuário ANTES das alterações
        await _snapshotService.GenerateSnapshotForUserAsync(userId, now, cancellationToken);

        var devices = await _deviceService.GetUserDevicesAsync(
            userId,
            pageNumber: 1,
            pageSize: 30,
            cancellationToken
        );

        var actionsToLog = new List<Entity.DeviceAction>();

        foreach (var device in devices)
        {
            if (device.UserId != userId)
                throw new UnauthorizedAccessException(
                    $"O dispositivo de id {device.Id} não pertence ao usuário."
                );

            if (device.IsDimmable == false)
                device.Brightness = null;
            else
                device.Brightness = request.Status == DeviceStatus.On ? 100 : 0;

            if (request.Status == DeviceStatus.On)
                device.HandleTurnOn(now);
            else
                device.HandleTurnOff(now);

            var powerAtMoment =
                device.IsDimmable == true && device.Brightness.HasValue
                    ? device.PowerWatts * (device.Brightness.Value / 100f)
                    : device.PowerWatts;

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
                    BrightnessAtMoment = device.Brightness,
                    PowerAtMoment = powerAtMoment,
                }
            );

            await _deviceService.UpdateDeviceAsync(device, cancellationToken);
        }

        await _deviceService.ControlAllUserDevicesAsync(userId, request.Status, cancellationToken);
        await _deviceActionService.LogDeviceActionsAsync(actionsToLog, cancellationToken);

        return Unit.Value;
    }
}
