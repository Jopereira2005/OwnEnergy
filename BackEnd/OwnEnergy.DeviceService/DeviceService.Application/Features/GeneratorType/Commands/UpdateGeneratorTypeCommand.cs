using System.Text.Json.Serialization;
using MediatR;

namespace DeviceService.Application.Features.GeneratorType.Commands;

public class UpdateGeneratorTypeCommand : IRequest
{
    [JsonIgnore]
    public Guid UserId { get; set; }

    [JsonIgnore]
    public Guid Id { get; set; }

    public string TypeName { get; set; } = null!;
}
