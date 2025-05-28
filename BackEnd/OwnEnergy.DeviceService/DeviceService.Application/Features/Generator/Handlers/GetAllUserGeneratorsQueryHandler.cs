using AutoMapper;
using DeviceService.Application.DTOs;
using DeviceService.Application.Features.Generator.Queries;
using DeviceService.Domain.Interfaces;
using MediatR;

namespace DeviceService.Application.Features.Generator.Handlers;

public class GetAllUserGeneratorsQueryHandler(
    IGeneratorRepository generatorRepository,
    IMapper mapper
) : IRequestHandler<GetAllUserGeneratorsQuery, IEnumerable<GeneratorResponseDTO>>
{
    private readonly IGeneratorRepository _generatorRepository = generatorRepository;
    private readonly IMapper _mapper = mapper;

    public async Task<IEnumerable<GeneratorResponseDTO>> Handle(
        GetAllUserGeneratorsQuery request,
        CancellationToken cancellationToken
    )
    {
        var generators = await _generatorRepository.GetAllByUserIdAsync(
            request.UserId,
            cancellationToken
        );
        return _mapper.Map<IEnumerable<GeneratorResponseDTO>>(generators);
    }
}
