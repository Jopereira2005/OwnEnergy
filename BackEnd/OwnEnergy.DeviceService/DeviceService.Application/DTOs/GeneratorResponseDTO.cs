namespace DeviceService.Application.DTOs;

public class GeneratorResponseDTO
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string GeneratorTypeName { get; set; } = null!;

    public float GenerationRateWattsPerHour { get; set; }

    public double TotalEnergyGeneratedKWh { get; set; }

    public bool IsActive { get; set; }

    public TimeSpan TotalUptime { get; set; }

    public DateTime? LastActivatedAt { get; set; }
}
