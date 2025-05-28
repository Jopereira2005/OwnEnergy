using DeviceService.Application.DTOs;
using DeviceService.Application.Features.GeneratorType.Commands;
using DeviceService.Application.Features.GeneratorType.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeviceService.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GeneratorTypeController(IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateGeneratorType(
        [FromBody] CreateGeneratorTypeCommand command
    )
    {
        await _mediator.Send(command);
        return NoContent();
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<PaginatedResultDTO<GeneratorTypeResponseDTO>>> GetAll(
        [FromQuery] GetAllGeneratorTypesQuery query
    )
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
