using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using DeviceService.Domain.Enums;
using DeviceService.Domain.Primitives;

namespace DeviceService.Domain.Entities;

public class Device : Entity
{
    public Guid DeviceTypeId { get; set; }
    public required DeviceType DeviceType { get; set; }

    public Guid UserId { get; set; }
    public Guid RoomId { get; set; }
    public Guid? GroupId { get; set; }

    [Range(3, 50)]
    public required string Name { get; set; }

    [DefaultValue(false)]
    public bool? IsDimmable { get; set; }

    [Range(0, 100)]
    public int? Brightness { get; set; }

    public DeviceStatus Status { get; set; }
    public float PowerWatts { get; set; }

    public DateTime? LastTurnedOnAt { get; set; }

    public TimeSpan TotalUptime { get; set; }
    public double TotalEnergyKWh { get; set; }

    public ICollection<DeviceAction> DeviceActions { get; set; } = [];

    public bool IsCurrentlyActive => Status == DeviceStatus.On && LastTurnedOnAt is not null;

    public void HandleTurnOn(DateTime timestamp)
    {
        if (IsCurrentlyActive)
            return; // Already on

        LastTurnedOnAt = timestamp;
        Status = DeviceStatus.On;
    }

    public void HandleTurnOff(DateTime timestamp)
    {
        if (!IsCurrentlyActive || LastTurnedOnAt is null)
            return;

        var uptime = timestamp - LastTurnedOnAt.Value;
        var energy = GetCurrentSessionEnergyKWh(timestamp);

        TotalUptime += uptime;
        TotalEnergyKWh += energy;

        LastTurnedOnAt = null;
        Status = DeviceStatus.Off;
    }

    public double GetCurrentSessionEnergyKWh(DateTime now)
    {
        if (!IsCurrentlyActive || LastTurnedOnAt is null)
            return 0;

        var duration = now - LastTurnedOnAt.Value;
        return (PowerWatts * duration.TotalHours) / 1000.0;
    }

    public TimeSpan GetCurrentSessionUptime(DateTime now)
    {
        if (!IsCurrentlyActive || LastTurnedOnAt is null)
            return TimeSpan.Zero;

        return now - LastTurnedOnAt.Value;
    }
}
