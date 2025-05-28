using DeviceService.Domain.Entities;

namespace DeviceService.Domain.Interfaces;

public interface IGeneratorRepository : IRepository<Generator>
{
    Task<IEnumerable<Generator>> GetAllByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    );

    Task<IEnumerable<Generator>> GetActiveGeneratorsAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    );

    Task ActivateGeneratorAsync(
        Guid generatorId,
        DateTime timestamp,
        CancellationToken cancellationToken = default
    );

    Task DeactivateGeneratorAsync(
        Guid generatorId,
        DateTime timestamp,
        CancellationToken cancellationToken = default
    );
}
