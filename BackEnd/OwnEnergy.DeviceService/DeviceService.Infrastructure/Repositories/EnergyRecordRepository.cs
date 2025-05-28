using DeviceService.Domain.Entities;
using DeviceService.Domain.Interfaces;
using DeviceService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DeviceService.Infrastructure.Repositories;

public class EnergyRecordRepository(DataContext dataContext)
    : Repository<EnergyRecord>(dataContext),
        IEnergyRecordRepository
{
    private readonly DbSet<EnergyRecord> _dbSet = dataContext.Set<EnergyRecord>();

    public async Task<EnergyRecord?> GetLatestByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    ) =>
        await _dbSet
            .Where(er => er.UserId == userId)
            .OrderByDescending(er => er.Date)
            .FirstOrDefaultAsync(cancellationToken);

    public async Task<IEnumerable<EnergyRecord>> GetByDateRangeAsync(
        Guid userId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default
    ) =>
        await _dbSet
            .Where(er =>
                er.UserId == userId
                && er.Date >= DateOnly.FromDateTime(startDate)
                && er.Date <= DateOnly.FromDateTime(endDate)
            )
            .OrderBy(er => er.Date)
            .ToListAsync(cancellationToken);

    public async Task<EnergyRecord?> GetByUserIdAndDateAsync(
        Guid userId,
        DateOnly date,
        CancellationToken cancellationToken = default
    ) =>
        await _dbSet.FirstOrDefaultAsync(
            er => er.UserId == userId && er.Date == date,
            cancellationToken
        );
}
