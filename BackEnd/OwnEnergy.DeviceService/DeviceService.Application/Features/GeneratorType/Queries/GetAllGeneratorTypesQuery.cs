using DeviceService.Application.DTOs;
using MediatR;

namespace DeviceService.Application.Features.GeneratorType.Queries;

public class GetAllGeneratorTypesQuery : IRequest<PaginatedResultDTO<GeneratorTypeResponseDTO>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;

    public GetAllGeneratorTypesQuery() { }

    public GetAllGeneratorTypesQuery(int page, int pageSize)
    {
        Page = page;
        PageSize = pageSize;
    }
}
