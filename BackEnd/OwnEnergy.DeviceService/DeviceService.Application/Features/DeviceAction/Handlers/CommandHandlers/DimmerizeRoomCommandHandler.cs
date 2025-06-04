using DeviceService.Application.Common.Services.Interfaces;
using DeviceService.Application.Features.DeviceAction.Commands;
using DeviceService.Domain.Enums;
using DeviceService.Domain.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Entity = DeviceService.Domain.Entities;

namespace DeviceService.Application.Features.DeviceAction.Handlers.CommandHandlers;

public class DimmerizeRoomCommandHandler(
    IDeviceService deviceService,
    IDeviceActionService deviceActionService,
    IHttpContextAccessor httpContextAccessor,
    IValidator<DimmerizeRoomCommand> validator
) : IRequestHandler<DimmerizeRoomCommand>
{
    private readonly IDeviceService _deviceService = deviceService;
    private readonly IDeviceActionService _deviceActionService = deviceActionService;
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
    private readonly IValidator<DimmerizeRoomCommand> _validator = validator;

    public async Task<Unit> Handle(
        DimmerizeRoomCommand request,
        CancellationToken cancellationToken
    )
    {
        await _validator.ValidateAndThrowAsync(request, cancellationToken);

        var userIdStr =
            _httpContextAccessor.HttpContext?.Items["UserId"]?.ToString()
            ?? throw new UnauthorizedAccessException("Usuário não autenticado.");

        var userId = Guid.Parse(userIdStr);

        var devices = await _deviceService.GetUserDevicesByRoomIdAsync(
            userId,
            request.RoomId,
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

            if (device.IsDimmable == false)
                continue;

            device.Brightness = request.Brightness;

            if (request.Brightness == 0)
                device.HandleTurnOff(now);
            else
                device.HandleTurnOn(now);

            await _deviceService.UpdateDeviceAsync(device, cancellationToken);

            actionsToLog.Add(
                new Entity.DeviceAction
                {
                    DeviceId = device.Id,
                    UserId = userId,
                    Action = request.Brightness == 0 ? DeviceActions.TurnOff : DeviceActions.Dim,
                    Status = ActionStatus.Success,
                }
            );
        }

        await _deviceService.ControlBrightnessByUserRoomAsync(
            userId,
            request.RoomId,
            request.Brightness,
            request.Brightness == 0 ? DeviceStatus.Off : DeviceStatus.On,
            cancellationToken
        );

        await _deviceActionService.LogDeviceActionsAsync(actionsToLog, cancellationToken);

        return Unit.Value;
    }
}
