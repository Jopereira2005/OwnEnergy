using DeviceService.Application.Common.Services.Interfaces;
using DeviceService.Application.Features.DeviceAction.Commands;
using DeviceService.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;
using Entity = DeviceService.Domain.Entities;

namespace DeviceService.Application.Features.DeviceAction.Handlers.CommandHandlers;

public class SwitchDeviceCommandHandler(
    IDeviceService deviceService,
    IDeviceActionService deviceActionService,
    IDeviceSnapshotService deviceSnapshotService,
    IHttpContextAccessor httpContextAccessor
) : IRequestHandler<SwitchDeviceCommand>
{
    private readonly IDeviceService _deviceService = deviceService;
    private readonly IDeviceActionService _deviceActionService = deviceActionService;
    private readonly IDeviceSnapshotService _deviceSnapshotService = deviceSnapshotService;
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

    public async Task<Unit> Handle(SwitchDeviceCommand request, CancellationToken cancellationToken)
    {
        var userIdStr =
            _httpContextAccessor.HttpContext?.Items["UserId"]?.ToString()
            ?? throw new UnauthorizedAccessException("Usuário não autenticado.");

        var userId = Guid.Parse(userIdStr);

        var device =
            await _deviceService.GetDeviceByIdAsync(request.DeviceId, cancellationToken)
            ?? throw new KeyNotFoundException(
                $"Dispositivo com ID {request.DeviceId} não encontrado."
            );

        if (device.UserId != userId)
            throw new UnauthorizedAccessException(
                $"O dispositivo de id {request.DeviceId} não pertence ao usuário."
            );

        var now = DateTime.UtcNow;

        var newStatus = device.Status == DeviceStatus.On ? DeviceStatus.Off : DeviceStatus.On;
        var newBrightness = newStatus == DeviceStatus.On ? 100 : 0;
        device.Brightness = newBrightness;

        // ✅ Gera snapshots se o dispositivo for desligado
        if (newStatus == DeviceStatus.Off)
        {
            await _deviceSnapshotService.GenerateSnapshotForUserAsync(
                userId,
                now,
                cancellationToken
            );
            await _deviceSnapshotService.GenerateSnapshotForDeviceAsync(
                device,
                now,
                cancellationToken
            );
        }

        if (newStatus == DeviceStatus.On)
            device.HandleTurnOn(now);
        else
            device.HandleTurnOff(now);

        device.Status = newStatus;

        await _deviceService.UpdateDeviceAsync(device, cancellationToken);

        await _deviceActionService.LogDeviceActionAsync(
            new Entity.DeviceAction
            {
                DeviceId = device.Id,
                Action =
                    newStatus == DeviceStatus.On ? DeviceActions.TurnOn : DeviceActions.TurnOff,
                UserId = userId,
                Status = ActionStatus.Success,
                BrightnessAtMoment = device.Brightness,
                PowerAtMoment =
                    device.IsDimmable == true && device.Brightness.HasValue
                        ? device.PowerWatts * (device.Brightness.Value / 100f)
                        : device.PowerWatts,
            },
            cancellationToken
        );

        return Unit.Value;
    }
}
