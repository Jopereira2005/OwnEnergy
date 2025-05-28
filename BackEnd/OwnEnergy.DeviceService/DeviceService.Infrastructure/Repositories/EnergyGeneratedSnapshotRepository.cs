using DeviceService.Domain.Entities;
using DeviceService.Domain.Interfaces;
using DeviceService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DeviceService.Infrastructure.Repositories;

public class EnergyGeneratedSnapshotRepository(DataContext dataContext)
    : Repository<EnergyGeneratedSnapshot>(dataContext),
        IEnergyGeneratedSnapshotRepository
{
    private readonly DbSet<EnergyGeneratedSnapshot> _dbSet =
        dataContext.Set<EnergyGeneratedSnapshot>();

    public async Task<EnergyGeneratedSnapshot?> GetLatestSnapshotByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    ) =>
        await _dbSet
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.Timestamp)
            .FirstOrDefaultAsync(cancellationToken);

    public async Task<IEnumerable<EnergyGeneratedSnapshot>> GetSnapshotsByUserIdAsync(
        Guid userId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default
    ) =>
        await _dbSet
            .Where(s => s.UserId == userId && s.Timestamp >= startDate && s.Timestamp <= endDate)
            .OrderBy(s => s.Timestamp)
            .ToListAsync(cancellationToken);

    public async Task<IEnumerable<EnergyGeneratedSnapshot>> GetSnapshotsByGeneratorIdAsync(
        Guid userId,
        Guid generatorId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default
    ) =>
        await _dbSet
            .Where(s =>
                s.UserId == userId
                && s.GeneratorId == generatorId
                && s.Timestamp >= startDate
                && s.Timestamp <= endDate
            )
            .OrderBy(s => s.Timestamp)
            .ToListAsync(cancellationToken);
}
