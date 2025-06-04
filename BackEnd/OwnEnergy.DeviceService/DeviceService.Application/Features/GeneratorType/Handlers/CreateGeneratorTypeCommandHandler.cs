using AutoMapper;
using DeviceService.Application.Features.GeneratorType.Commands;
using DeviceService.Domain.Interfaces;
using MediatR;
using Entity = DeviceService.Domain.Entities;

namespace DeviceService.Application.Features.GeneratorType.Handlers;

public class CreateDeviceTypeCommandHandler(
    IGeneratorTypeRepository generatorTypeRepository,
    IMapper mapper
) : IRequestHandler<CreateGeneratorTypeCommand>
{
    private readonly IGeneratorTypeRepository _generatorTypeRepository = generatorTypeRepository;
    private readonly IMapper _mapper = mapper;

    public async Task<Unit> Handle(
        CreateGeneratorTypeCommand request,
        CancellationToken cancellationToken
    )
    {
        var deviceType = _mapper.Map<Entity.GeneratorType>(request);
        await _generatorTypeRepository.CreateAsync(deviceType, cancellationToken);
        return Unit.Value;
    }
}
