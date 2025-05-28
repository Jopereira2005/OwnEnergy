using DeviceService.Domain.Entities;

namespace DeviceService.Domain.Interfaces;

public interface IEnergyRecordRepository : IRepository<EnergyRecord>
{
    Task<EnergyRecord?> GetLatestByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    );

    Task<IEnumerable<EnergyRecord>> GetByDateRangeAsync(
        Guid userId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default
    );

    Task<EnergyRecord?> GetByUserIdAndDateAsync(
        Guid userId,
        DateOnly date,
        CancellationToken cancellationToken = default
    );
}
