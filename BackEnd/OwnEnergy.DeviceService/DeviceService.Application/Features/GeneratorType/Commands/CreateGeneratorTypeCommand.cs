using System.Text.Json.Serialization;
using MediatR;

namespace DeviceService.Application.Features.GeneratorType.Commands;

public class CreateGeneratorTypeCommand : IRequest
{
    [JsonIgnore]
    public Guid Id { get; set; }

    public string TypeName { get; set; } = null!;
    public bool IsRenewable { get; set; }
    public string? Description { get; set; }
}
