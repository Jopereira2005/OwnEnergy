namespace DeviceService.Application.DTOs;

public class GeneratorTypeResponseDTO
{
    public Guid Id { get; set; }
    public string TypeName { get; set; } = null!;
    public bool IsRenewable { get; set; }
    public string? Description { get; set; }
}
