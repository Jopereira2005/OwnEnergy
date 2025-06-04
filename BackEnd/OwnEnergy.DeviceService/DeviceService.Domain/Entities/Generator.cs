using DeviceService.Domain.Primitives;

namespace DeviceService.Domain.Entities;

public class Generator : Entity
{
    public required string Name { get; set; }
    public Guid UserId { get; set; }

    public Guid GeneratorTypeId { get; set; }
    public required GeneratorType GeneratorType { get; set; }

    public float GenerationRateWattsPerHour { get; set; }

    public double TotalEnergyGeneratedKWh { get; set; }
    public TimeSpan TotalUptime { get; set; }

    public bool IsActive { get; set; } = false;
    public DateTime? LastActivatedAt { get; set; }

    public bool IsCurrentlyActive => IsActive && LastActivatedAt is not null;

    public void Activate(DateTime timestamp)
    {
        if (IsCurrentlyActive)
            return;

        LastActivatedAt = timestamp;
        IsActive = true;
    }

    public void Deactivate(DateTime timestamp)
    {
        if (!IsCurrentlyActive || LastActivatedAt is null)
            return;

        var duration = timestamp - LastActivatedAt.Value;
        var energy = GetCurrentSessionEnergyKWh(timestamp);

        TotalUptime += duration;
        TotalEnergyGeneratedKWh += energy;

        LastActivatedAt = null;
        IsActive = false;
    }

    public double GetCurrentSessionEnergyKWh(DateTime now)
    {
        if (!IsCurrentlyActive || LastActivatedAt is null)
            return 0;

        var duration = now - LastActivatedAt.Value;
        return (GenerationRateWattsPerHour * duration.TotalHours) / 1000.0;
    }

    public TimeSpan GetCurrentSessionUptime(DateTime now)
    {
        if (!IsCurrentlyActive || LastActivatedAt is null)
            return TimeSpan.Zero;

        return now - LastActivatedAt.Value;
    }
}
