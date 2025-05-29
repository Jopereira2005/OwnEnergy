using DeviceService.Application.DTOs;
using DeviceService.Application.Features.Energy.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeviceService.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EnergyController(IMediator mediator, IHttpContextAccessor httpContextAccessor)
    : ControllerBase
{
    private readonly IMediator _mediator = mediator;
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

    private Guid GetUserId()
    {
        var userIdStr =
            _httpContextAccessor.HttpContext?.Items["UserId"]?.ToString()
            ?? throw new UnauthorizedAccessException("Usuário não autenticado.");
        return Guid.Parse(userIdStr);
    }

    [Authorize]
    [HttpGet("energy/summary")]
    public async Task<ActionResult<EnergyResponseDTO>> GetEnergySummary()
    {
        var userId = GetUserId();
        var result = await _mediator.Send(new GetEnergySummaryQuery(userId));
        return Ok(result);
    }

    [Authorize]
    [HttpGet("energy/room-consumption")]
    public async Task<ActionResult<RoomEnergyConsumptionResponseDTOList>> GetRoomEnergyConsumption()
    {
        var userId = GetUserId();
        var result = await _mediator.Send(new GetRoomEnergyConsumptionQuery(userId));
        return Ok(result);
    }
}
