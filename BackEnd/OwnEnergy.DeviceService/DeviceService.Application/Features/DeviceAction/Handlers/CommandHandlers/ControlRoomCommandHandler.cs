using DeviceService.Application.Common.Services.Interfaces;
using DeviceService.Application.Features.DeviceAction.Commands;
using DeviceService.Domain.Enums;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Entity = DeviceService.Domain.Entities;

namespace DeviceService.Application.Features.DeviceAction.Handlers.CommandHandlers;

public class ControlRoomCommandHandler(
    IDeviceService deviceService,
    IDeviceActionService deviceActionService,
    IDeviceSnapshotService deviceSnapshotService,
    IHttpContextAccessor httpContextAccessor,
    IValidator<ControlRoomCommand> validator
) : IRequestHandler<ControlRoomCommand>
{
    private readonly IDeviceService _deviceService = deviceService;
    private readonly IDeviceActionService _deviceActionService = deviceActionService;
    private readonly IDeviceSnapshotService _deviceSnapshotService = deviceSnapshotService;
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
    private readonly IValidator<ControlRoomCommand> _validator = validator;

    public async Task<Unit> Handle(ControlRoomCommand request, CancellationToken cancellationToken)
    {
        await _validator.ValidateAndThrowAsync(request, cancellationToken);

        var userIdStr =
            _httpContextAccessor.HttpContext?.Items["UserId"]?.ToString()
            ?? throw new UnauthorizedAccessException("Usuário não autenticado.");

        var userId = Guid.Parse(userIdStr);
        var now = DateTime.UtcNow;

        var devices = await _deviceService.GetUserDevicesByRoomIdAsync(
            userId,
            request.RoomId,
            pageNumber: 1,
            pageSize: 30,
            cancellationToken
        );

        // ✅ Antes de desligar, gerar snapshots da sessão atual
        if (request.Status == DeviceStatus.Off)
        {
            await _deviceSnapshotService.GenerateSnapshotForUserAsync(
                userId,
                now,
                cancellationToken
            );
            await _deviceSnapshotService.GenerateSnapshotForRoomAsync(
                userId,
                request.RoomId,
                now,
                cancellationToken
            );
        }

        var actionsToLog = new List<Entity.DeviceAction>();

        foreach (var device in devices)
        {
            if (device.UserId != userId)
                throw new UnauthorizedAccessException(
                    $"O dispositivo de id {device.Id} não pertence ao usuário."
                );

            device.Brightness =
                device.IsDimmable == true ? (request.Status == DeviceStatus.On ? 100 : 0) : null;

            if (request.Status == DeviceStatus.On)
                device.HandleTurnOn(now);
            else
                device.HandleTurnOff(now);

            await _deviceService.UpdateDeviceAsync(device, cancellationToken);

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
                    PowerAtMoment =
                        device.IsDimmable == true && device.Brightness.HasValue
                            ? device.PowerWatts * (device.Brightness.Value / 100f)
                            : device.PowerWatts,
                }
            );
        }

        await _deviceService.ControlUserDevicesByRoomIdAsync(
            userId,
            request.RoomId,
            request.Status,
            cancellationToken
        );

        await _deviceActionService.LogDeviceActionsAsync(actionsToLog, cancellationToken);

        return Unit.Value;
    }
}
