using DeviceService.Domain.Primitives;

namespace DeviceService.Domain.Entities;

public class EnergyGeneratedSnapshot : Entity
{
    public Guid UserId { get; set; } // User associated with the snapshot
    public Guid? GeneratorId { get; set; } // Optional generator ID for specific generator snapshots

    public float EnergyGeneratedKWh { get; set; } // Total energy generated in kWh
    public TimeSpan SessionDuration { get; set; } // Duration of the session for which the snapshot was taken

    public DateTime Timestamp { get; set; } // Timestamp of the snapshot

    public string? Notes { get; set; } // Optional notes for the snapshot
}
