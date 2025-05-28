using DeviceService.Application.DTOs;
using MediatR;

namespace DeviceService.Application.Features.Generator.Queries;

public class GetAllUserGeneratorsQuery(Guid userId) : IRequest<IEnumerable<GeneratorResponseDTO>>
{
    public Guid UserId { get; set; } = userId;
}
