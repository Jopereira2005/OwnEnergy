using DeviceService.Application.Common.Services.Interfaces;
using DeviceService.Domain.Entities;
using DeviceService.Domain.Interfaces;

namespace DeviceService.Application.Common.Services;

public class DeviceSnapshotService(
    IDeviceRepository deviceRepository,
    IEnergyConsumptionSnapshotRepository snapshotRepository
) : IDeviceSnapshotService
{
    private readonly IDeviceRepository _deviceRepository = deviceRepository;
    private readonly IEnergyConsumptionSnapshotRepository _snapshotRepository = snapshotRepository;

    public async Task GenerateSnapshotForDeviceAsync(
        Device device,
        DateTime timestamp,
        CancellationToken cancellationToken = default
    )
    {
        if (!device.IsCurrentlyActive || device.LastTurnedOnAt is null)
            return;

        var snapshot = BuildSnapshot(
            device.UserId,
            device.Id,
            null,
            timestamp,
            device.GetCurrentSessionUptime(timestamp),
            device.GetCurrentSessionEnergyKWh(timestamp),
            "Gerado automaticamente ao controlar dispositivo"
        );

        await _snapshotRepository.CreateAsync(snapshot, cancellationToken);
    }

    public async Task GenerateSnapshotForRoomAsync(
        Guid userId,
        Guid roomId,
        DateTime timestamp,
        CancellationToken cancellationToken = default
    )
    {
        var devicesInRoom = await _deviceRepository.GetUserDevicesByRoomIdAsync(
            userId,
            roomId,
            1,
            1000,
            cancellationToken
        );

        var activeDevices = devicesInRoom
            .Where(d => d.IsCurrentlyActive && d.LastTurnedOnAt is not null)
            .ToList();

        if (activeDevices.Count == 0)
            return;

        var totalDuration = activeDevices.Aggregate(
            TimeSpan.Zero,
            (sum, d) => sum + d.GetCurrentSessionUptime(timestamp)
        );

        var totalEnergy = activeDevices.Sum(d => d.GetCurrentSessionEnergyKWh(timestamp));

        var snapshot = BuildSnapshot(
            userId,
            null,
            roomId,
            timestamp,
            totalDuration,
            totalEnergy,
            "Snapshot agregado por sala"
        );

        await _snapshotRepository.CreateAsync(snapshot, cancellationToken);
    }

    public async Task GenerateSnapshotForUserAsync(
        Guid userId,
        DateTime timestamp,
        CancellationToken cancellationToken = default
    )
    {
        var activeDevices = await _deviceRepository.GetActiveDevicesAsync(
            userId,
            cancellationToken
        );

        if (!activeDevices.Any())
            return;

        var totalDuration = activeDevices.Aggregate(
            TimeSpan.Zero,
            (sum, d) => sum + d.GetCurrentSessionUptime(timestamp)
        );

        var totalEnergy = activeDevices.Sum(d => d.GetCurrentSessionEnergyKWh(timestamp));

        var snapshot = BuildSnapshot(
            userId,
            null,
            null,
            timestamp,
            totalDuration,
            totalEnergy,
            "Snapshot agregado do usuário"
        );

        await _snapshotRepository.CreateAsync(snapshot, cancellationToken);
    }

    private static EnergyConsumptionSnapshot BuildSnapshot(
        Guid userId,
        Guid? deviceId,
        Guid? roomId,
        DateTime timestamp,
        TimeSpan sessionDuration,
        double energyConsumedKWh,
        string notes
    )
    {
        return new EnergyConsumptionSnapshot
        {
            UserId = userId,
            DeviceId = deviceId,
            RoomId = roomId,
            Timestamp = timestamp,
            SessionDuration = sessionDuration,
            EnergyConsumedKWh = (float)energyConsumedKWh,
            Notes = notes,
        };
    }
}
