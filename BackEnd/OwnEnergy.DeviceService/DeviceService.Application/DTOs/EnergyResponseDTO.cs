namespace DeviceService.Application.DTOs;

public class EnergyResponseDTO
{
    public EnergyPeriodDto Daily { get; set; } = new();
    public EnergyPeriodDto Weekly { get; set; } = new();
    public EnergyPeriodDto Monthly { get; set; } = new();
    public EnergyPeriodDto Yearly { get; set; } = new();
}

public class EnergyPeriodDto
{
    public float EnergyConsumedKWh { get; set; }
    public float EnergyGeneratedKWh { get; set; }

    public DateTime From { get; set; }
    public DateTime To { get; set; }
}
