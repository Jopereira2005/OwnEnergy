using DeviceService.Application.DTOs;
using MediatR;

namespace DeviceService.Application.Features.Energy.Queries;

public class GetRoomEnergyConsumptionQuery(Guid userId)
    : IRequest<RoomEnergyConsumptionResponseDTOList>
{
    public Guid UserId { get; set; } = userId;
}
