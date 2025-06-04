using System.Text.Json.Serialization;
using MediatR;

namespace DeviceService.Application.Features.Generator.Commands;

public class UpdateGeneratorNameCommand : IRequest
{
    [JsonIgnore]
    public Guid UserId { get; set; }

    [JsonIgnore]
    public Guid Id { get; set; }

    public required string Name { get; set; }
}
