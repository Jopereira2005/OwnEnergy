using System.Text.Json.Serialization;
using MediatR;

namespace DeviceService.Application.Features.Generator.Commands;

public class CreateGeneratorCommand : IRequest<Guid>
{
    [JsonIgnore]
    public Guid UserId { get; set; }

    public string Name { get; set; } = null!;
}
