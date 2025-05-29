using DeviceService.Application.DTOs;
using DeviceService.Application.Features.Generator.Commands;
using DeviceService.Application.Features.Generator.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeviceService.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GeneratorController(IMediator mediator, IHttpContextAccessor httpContextAccessor)
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
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateGeneratorCommand command)
    {
        command.UserId = GetUserId();
        var id = await _mediator.Send(command);
        return Ok(id);
    }

    [Authorize]
    [HttpGet("all-user")]
    public async Task<ActionResult<IEnumerable<GeneratorResponseDTO>>> GetAllUser()
    {
        var userId = GetUserId();
        var result = await _mediator.Send(new GetAllUserGeneratorsQuery(userId));
        return Ok(result);
    }

    [Authorize]
    [HttpPut("{id:guid}/activate")]
    public async Task<IActionResult> Activate(Guid id)
    {
        var command = new ActivateGeneratorCommand { Id = id, UserId = GetUserId() };

        await _mediator.Send(command);
        return NoContent();
    }

    [Authorize]
    [HttpPut("{id:guid}/deactivate")]
    public async Task<IActionResult> Deactivate(Guid id)
    {
        var command = new DeactivateGeneratorCommand { Id = id, UserId = GetUserId() };

        await _mediator.Send(command);
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var command = new DeleteGeneratorCommand { Id = id, UserId = GetUserId() };

        await _mediator.Send(command);
        return NoContent();
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateName(
        Guid id,
        [FromBody] UpdateGeneratorNameCommand command
    )
    {
        command.Id = id;
        command.UserId = GetUserId();
        await _mediator.Send(command);
        return NoContent();
    }
}
