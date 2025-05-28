using DeviceService.Application.Common.Services.Interfaces;
using DeviceService.Application.Features.DeviceAction.Commands;
using DeviceService.Domain.Enums;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Entity = DeviceService.Domain.Entities;

namespace DeviceService.Application.Features.DeviceAction.Handlers.CommandHandlers;

public class ControlDeviceCommandHandler(
    IDeviceService deviceService,
    IDeviceActionService deviceActionService,
    IDeviceSnapshotService deviceSnapshotService,
    IHttpContextAccessor httpContextAccessor,
    IValidator<ControlDeviceCommand> validator
) : IRequestHandler<ControlDeviceCommand>
{
    private readonly IDeviceService _deviceService = deviceService;
    private readonly IDeviceActionService _deviceActionService = deviceActionService;
    private readonly IDeviceSnapshotService _deviceSnapshotService = deviceSnapshotService;
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
    private readonly IValidator<ControlDeviceCommand> _validator = validator;

    public async Task<Unit> Handle(
        ControlDeviceCommand request,
        CancellationToken cancellationToken
    )
    {
        await _validator.ValidateAndThrowAsync(request, cancellationToken);

        var userIdStr =
            _httpContextAccessor.HttpContext?.Items["UserId"]?.ToString()
            ?? throw new UnauthorizedAccessException("Usuário não autenticado.");

        var userId = Guid.Parse(userIdStr);
        var device = await _deviceService.GetDeviceByIdAsync(request.DeviceId, cancellationToken);

        if (device.UserId != userId)
            throw new UnauthorizedAccessException(
                $"O dispositivo de id {request.DeviceId} não pertence ao usuário."
            );

        if (device.IsDimmable == false)
            device.Brightness = null;
        else
            device.Brightness = request.Status == DeviceStatus.On ? 100 : 0;

        var now = DateTime.UtcNow;

        var powerAtMoment =
            device.IsDimmable == true && device.Brightness.HasValue
                ? device.PowerWatts * (device.Brightness.Value / 100f)
                : device.PowerWatts;

        // ✅ Gera snapshot da sessão antes de desligar (se necessário)
        if (
            request.Status == DeviceStatus.Off
            && device.IsCurrentlyActive
            && device.LastTurnedOnAt is not null
        )
        {
            await _deviceSnapshotService.GenerateSnapshotForDeviceAsync(
                device,
                now,
                cancellationToken
            );
            await _deviceSnapshotService.GenerateSnapshotForUserAsync(
                userId,
                now,
                cancellationToken
            );
        }

        // Aplica a mudança de estado
        if (request.Status == DeviceStatus.On)
            device.HandleTurnOn(now);
        else
            device.HandleTurnOff(now);

        var deviceAction = new Entity.DeviceAction
        {
            DeviceId = device.Id,
            UserId = userId,
            Action =
                request.Status == DeviceStatus.On ? DeviceActions.TurnOn : DeviceActions.TurnOff,
            Status = ActionStatus.Success,
            BrightnessAtMoment = device.Brightness,
            PowerAtMoment = powerAtMoment,
        };

        await _deviceService.ControlDeviceAsync(device.Id, request.Status, cancellationToken);
        await _deviceService.UpdateDeviceAsync(device, cancellationToken);
        await _deviceActionService.LogDeviceActionAsync(deviceAction, cancellationToken);

        return Unit.Value;
    }
}
