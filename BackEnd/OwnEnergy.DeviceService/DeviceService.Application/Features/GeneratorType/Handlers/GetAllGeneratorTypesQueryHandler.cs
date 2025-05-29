using AutoMapper;
using DeviceService.Application.DTOs;
using DeviceService.Application.Features.GeneratorType.Queries;
using DeviceService.Domain.Interfaces;
using MediatR;

namespace DeviceService.Application.Features.GeneratorType.Handlers;

public class GetAllGeneratorTypesQueryHandler(
    IGeneratorTypeRepository generatorTypeRepository,
    IMapper mapper
) : IRequestHandler<GetAllGeneratorTypesQuery, PaginatedResultDTO<GeneratorTypeResponseDTO>>
{
    private readonly IGeneratorTypeRepository _generatorTypeRepository = generatorTypeRepository;
    private readonly IMapper _mapper = mapper;

    public async Task<PaginatedResultDTO<GeneratorTypeResponseDTO>> Handle(
        GetAllGeneratorTypesQuery request,
        CancellationToken cancellationToken
    )
    {
        var generatorTypes = await _generatorTypeRepository.GetAllAsync(
            request.Page,
            request.PageSize,
            cancellationToken
        );
        var totalCount = await _generatorTypeRepository.CountAsync();
        var response = _mapper.Map<IEnumerable<GeneratorTypeResponseDTO>>(generatorTypes);

        return new PaginatedResultDTO<GeneratorTypeResponseDTO>(
            totalCount,
            request.Page,
            request.PageSize,
            response
        );
    }
}
