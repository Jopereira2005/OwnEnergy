namespace DeviceService.Application.DTOs;

public class RoomEnergyConsumptionResponseDTO
{
    public Guid RoomId { get; set; }
    public float EnergyConsumption { get; set; }
    public int PercentageOfTotal { get; set; }
}

public class RoomEnergyConsumptionResponseDTOList
{
    public List<RoomEnergyConsumptionResponseDTO> RoomEnergyConsumptions { get; set; } =
        new List<RoomEnergyConsumptionResponseDTO>();
}
