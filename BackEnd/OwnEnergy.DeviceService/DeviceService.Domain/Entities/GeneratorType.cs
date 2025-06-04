using DeviceService.Domain.Primitives;

namespace DeviceService.Domain.Entities;

public class GeneratorType : Entity
{
    public required string TypeName { get; set; }
    public bool IsRenewable { get; set; }
    public string? Description { get; set; }
    public ICollection<Generator> Generators { get; set; } = [];
}
