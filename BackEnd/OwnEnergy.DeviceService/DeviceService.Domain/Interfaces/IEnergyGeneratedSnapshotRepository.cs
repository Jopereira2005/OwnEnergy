using DeviceService.Domain.Entities;

namespace DeviceService.Domain.Interfaces;

public interface IEnergyGeneratedSnapshotRepository : IRepository<EnergyGeneratedSnapshot>
{
    Task<EnergyGeneratedSnapshot?> GetLatestSnapshotByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    );
    Task<IEnumerable<EnergyGeneratedSnapshot>> GetSnapshotsByUserIdAsync(
        Guid userId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default
    );
    Task<IEnumerable<EnergyGeneratedSnapshot>> GetSnapshotsByGeneratorIdAsync(
        Guid userId,
        Guid generatorId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default
    );
}
