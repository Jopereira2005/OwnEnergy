using DeviceService.Domain.Entities;

namespace DeviceService.Domain.Interfaces;

public interface IGeneratorTypeRepository : IRepository<GeneratorType>
{
    Task<GeneratorType?> GetGeneratorTypeByNameAsync(
        string typeName,
        CancellationToken cancellationToken = default
    );
}
