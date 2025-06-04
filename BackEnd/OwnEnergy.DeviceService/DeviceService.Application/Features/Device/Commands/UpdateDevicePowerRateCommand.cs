using System.Text.Json.Serialization;
using MediatR;

namespace DeviceService.Application.Features.Device.Commands;

public class UpdateDevicePowerRateCommand : IRequest
{
    [JsonIgnore]
    public Guid UserId { get; set; }

    [JsonIgnore]
    public Guid Id { get; set; }

    public float PowerWatts { get; set; }

    [JsonIgnore]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
