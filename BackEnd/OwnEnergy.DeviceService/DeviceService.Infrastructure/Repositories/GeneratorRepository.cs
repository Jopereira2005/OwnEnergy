using DeviceService.Domain.Entities;
using DeviceService.Domain.Interfaces;
using DeviceService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DeviceService.Infrastructure.Repositories;

public class GeneratorRepository(DataContext dataContext)
    : Repository<Generator>(dataContext),
        IGeneratorRepository
{
    private readonly DbSet<Generator> _dbSet = dataContext.Set<Generator>();

    public async Task<IEnumerable<Generator>> GetAllByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        return await _dbSet
            .Include(g => g.GeneratorType)
            .Where(g => g.UserId == userId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Generator>> GetActiveGeneratorsAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        return await _dbSet
            .Where(g => g.UserId == userId && g.IsActive)
            .ToListAsync(cancellationToken);
    }

    public async Task ActivateGeneratorAsync(
        Guid generatorId,
        DateTime timestamp,
        CancellationToken cancellationToken = default
    )
    {
        var generator = await _dbSet.FirstOrDefaultAsync(
            g => g.Id == generatorId,
            cancellationToken
        );
        if (generator is null)
            return;

        generator.Activate(timestamp); // encapsula a lógica de validação

        _dbSet.Update(generator);
        await _dataContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeactivateGeneratorAsync(
        Guid generatorId,
        DateTime timestamp,
        CancellationToken cancellationToken = default
    )
    {
        var generator = await _dbSet.FirstOrDefaultAsync(
            g => g.Id == generatorId,
            cancellationToken
        );
        if (generator is null)
            return;

        generator.Deactivate(timestamp); // encapsula cálculo de uptime e energia

        _dbSet.Update(generator);
        await _dataContext.SaveChangesAsync(cancellationToken);
    }
}
