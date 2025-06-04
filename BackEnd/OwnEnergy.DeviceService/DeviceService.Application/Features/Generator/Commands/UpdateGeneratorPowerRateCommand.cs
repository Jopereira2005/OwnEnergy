using System.Text.Json.Serialization;
using MediatR;

namespace DeviceService.Application.Features.Generator.Commands;

public class UpdateGeneratorPowerRateCommand : IRequest
{
    [JsonIgnore]
    public Guid UserId { get; set; }

    [JsonIgnore]
    public Guid Id { get; set; }

    public float GenerationRateWattsPerHour { get; set; }

    [JsonIgnore]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
