using DeviceService.Application.Features.Device.Commands;
using DeviceService.Domain.Interfaces;
using MediatR;

namespace DeviceService.Application.Features.Device.Handlers.CommandHandlers;

public class UpdateDevicePowerRateCommandHandler(IDeviceRepository deviceRepository)
    : IRequestHandler<UpdateDevicePowerRateCommand, Unit>
{
    private readonly IDeviceRepository _deviceRepository = deviceRepository;

    public async Task<Unit> Handle(
        UpdateDevicePowerRateCommand request,
        CancellationToken cancellationToken
    )
    {
        var device =
            await _deviceRepository.GetByIdAsync(request.Id)
            ?? throw new KeyNotFoundException($"Device with ID {request.Id} not found.");

        device.PowerWatts = request.PowerWatts;

        await _deviceRepository.UpdateAsync(device, cancellationToken);

        return Unit.Value;
    }
}
