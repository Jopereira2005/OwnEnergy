namespace DeviceService.Application.DTOs;

public class DeviceResponseDTO
{
    public Guid Id { get; set; }
    public Guid DeviceTypeId { get; set; }
    public Guid UserId { get; set; }
    public Guid RoomId { get; set; }
    public Guid? GroupId { get; set; }
    public required string Name { get; set; }
    public float PowerWatts { get; set; }
    public bool? IsDimmable { get; set; }
    public int? Intensity { get; set; }
    public string Status { get; set; } = null!;
}
