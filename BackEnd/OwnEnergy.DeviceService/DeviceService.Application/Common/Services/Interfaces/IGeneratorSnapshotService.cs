using DeviceService.Domain.Entities;

namespace DeviceService.Application.Common.Services.Interfaces;

public interface IGeneratorSnapshotService
{
    Task GenerateSnapshotForGeneratorAsync(
        Generator generator,
        DateTime timestamp,
        CancellationToken cancellationToken = default
    );
    Task GenerateSnapshotForUserAsync(
        Guid userId,
        DateTime timestamp,
        CancellationToken cancellationToken = default
    );
}
