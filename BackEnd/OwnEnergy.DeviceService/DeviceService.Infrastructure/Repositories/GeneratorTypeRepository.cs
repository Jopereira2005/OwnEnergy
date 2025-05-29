using DeviceService.Domain.Entities;
using DeviceService.Domain.Interfaces;
using DeviceService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DeviceService.Infrastructure.Repositories;

public class GeneratorTypeRepository(DataContext dataContext)
    : Repository<GeneratorType>(dataContext),
        IGeneratorTypeRepository
{
    private readonly DbSet<GeneratorType> _dbSet = dataContext.Set<GeneratorType>();

    public async Task<GeneratorType?> GetGeneratorTypeByNameAsync(
        string typeName,
        CancellationToken cancellationToken = default
    ) => await _dbSet.FirstOrDefaultAsync(gt => gt.TypeName == typeName, cancellationToken);
}
