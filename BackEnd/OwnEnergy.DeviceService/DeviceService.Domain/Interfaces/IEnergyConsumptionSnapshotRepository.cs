using DeviceService.Domain.Entities;

namespace DeviceService.Domain.Interfaces;

public interface IEnergyConsumptionSnapshotRepository : IRepository<EnergyConsumptionSnapshot>
{
    Task<EnergyConsumptionSnapshot?> GetLatestSnapshotByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    );

    Task<IEnumerable<EnergyConsumptionSnapshot>> GetSnapshotsByUserIdAsync(
        Guid userId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default
    );

    Task<IEnumerable<EnergyConsumptionSnapshot>> GetSnapshotsByDeviceIdAsync(
        Guid userId,
        Guid deviceId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default
    );
    Task<IEnumerable<EnergyConsumptionSnapshot>> GetSnapshotsByRoomIdAsync(
        Guid userId,
        Guid roomId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default
    );
}
