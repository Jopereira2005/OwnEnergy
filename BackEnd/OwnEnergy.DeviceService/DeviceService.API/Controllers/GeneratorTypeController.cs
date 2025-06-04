using DeviceService.Application.DTOs;
using DeviceService.Application.Features.GeneratorType.Commands;
using DeviceService.Application.Features.GeneratorType.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeviceService.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GeneratorTypeController(IMediator mediator, IHttpContextAccessor httpContextAccessor)
    : ControllerBase
{
    private readonly IMediator _mediator = mediator;
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> CreateGeneratorType(
        [FromBody] CreateGeneratorTypeCommand command
    )
    {
        await _mediator.Send(command);
        return NoContent();
    }

    [Authorize]
    [HttpGet("all")]
    public async Task<ActionResult<PaginatedResultDTO<GeneratorTypeResponseDTO>>> GetAll(
        [FromQuery] GetAllGeneratorTypesQuery query
    )
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [Authorize]
    [HttpPut("{id:guid}/update-name")]
    public async Task<IActionResult> UpdateGeneratorType(
        Guid id,
        [FromBody] UpdateGeneratorTypeCommand command
    )
    {
        var userId = GetUserId();
        command.UserId = userId;
        command.Id = id;

        await _mediator.Send(command);
        return NoContent();
    }

    private Guid GetUserId()
    {
        var userIdStr =
            _httpContextAccessor.HttpContext?.Items["UserId"]?.ToString()
            ?? throw new UnauthorizedAccessException("Usuário não autenticado.");
        return Guid.Parse(userIdStr);
    }
}
