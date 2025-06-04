using System.Text.Json.Serialization;
using MediatR;

namespace DeviceService.Application.Features.Generator.Commands;

public class DeactivateGeneratorCommand : IRequest
{
    [JsonIgnore]
    public Guid UserId { get; set; }
    public Guid Id { get; set; }
}
