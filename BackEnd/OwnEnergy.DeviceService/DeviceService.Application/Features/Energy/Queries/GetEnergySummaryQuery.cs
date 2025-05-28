using DeviceService.Application.DTOs;
using MediatR;

namespace DeviceService.Application.Features.Energy.Queries;

public class GetEnergySummaryQuery(Guid userId) : IRequest<EnergyResponseDTO>
{
    public Guid UserId { get; set; } = userId;
}
