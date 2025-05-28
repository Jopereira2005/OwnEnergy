using DeviceService.Domain.Entities;

namespace DeviceService.Application.Common.Services.Interfaces;

public interface IDeviceSnapshotService
{
    Task GenerateSnapshotForDeviceAsync(
        Device device,
        DateTime timestamp,
        CancellationToken cancellationToken = default
    );

    Task GenerateSnapshotForRoomAsync(
        Guid userId,
        Guid roomId,
        DateTime timestamp,
        CancellationToken cancellationToken = default
    );

    Task GenerateSnapshotForUserAsync(
        Guid userId,
        DateTime timestamp,
        CancellationToken cancellationToken = default
    );
}
