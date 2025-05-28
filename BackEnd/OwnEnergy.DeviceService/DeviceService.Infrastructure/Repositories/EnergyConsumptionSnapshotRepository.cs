using DeviceService.Domain.Entities;
using DeviceService.Domain.Interfaces;
using DeviceService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DeviceService.Infrastructure.Repositories;

public class EnergyConsumptionSnapshotRepository(DataContext dataContext)
    : Repository<EnergyConsumptionSnapshot>(dataContext),
        IEnergyConsumptionSnapshotRepository
{
    private readonly DbSet<EnergyConsumptionSnapshot> _dbSet =
        dataContext.Set<EnergyConsumptionSnapshot>();

    public async Task<EnergyConsumptionSnapshot?> GetLatestSnapshotByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    ) =>
        await _dbSet
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.Timestamp)
            .FirstOrDefaultAsync(cancellationToken);

    public async Task<IEnumerable<EnergyConsumptionSnapshot>> GetSnapshotsByUserIdAsync(
        Guid userId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default
    ) =>
        await _dbSet
            .Where(s => s.UserId == userId && s.Timestamp >= startDate && s.Timestamp <= endDate)
            .OrderBy(s => s.Timestamp)
            .ToListAsync(cancellationToken);

    public async Task<IEnumerable<EnergyConsumptionSnapshot>> GetSnapshotsByDeviceIdAsync(
        Guid userId,
        Guid deviceId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default
    ) =>
        await _dbSet
            .Where(s =>
                s.UserId == userId
                && s.DeviceId == deviceId
                && s.Timestamp >= startDate
                && s.Timestamp <= endDate
            )
            .OrderBy(s => s.Timestamp)
            .ToListAsync(cancellationToken);

    public async Task<IEnumerable<EnergyConsumptionSnapshot>> GetSnapshotsByRoomIdAsync(
        Guid userId,
        Guid roomId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default
    ) =>
        await _dbSet
            .Where(s =>
                s.UserId == userId
                && s.RoomId == roomId
                && s.Timestamp >= startDate
                && s.Timestamp <= endDate
            )
            .OrderBy(s => s.Timestamp)
            .ToListAsync(cancellationToken);
}
