using DeviceService.Domain.Primitives;

namespace DeviceService.Domain.Entities;

public class EnergyConsumptionSnapshot : Entity
{
    public Guid UserId { get; set; } // User associated with the snapshot
    public Guid? DeviceId { get; set; } // Optional device ID for specific device snapshots
    public Guid? RoomId { get; set; } // Optional room ID for room-wide snapshots

    public float EnergyConsumedKWh { get; set; } // Total energy consumed in kWh
    public TimeSpan SessionDuration { get; set; } // Duration of the session for which the snapshot was taken

    public DateTime Timestamp { get; set; } // Timestamp of the snapshot

    public string? Notes { get; set; } // Optional notes for the snapshot
}
