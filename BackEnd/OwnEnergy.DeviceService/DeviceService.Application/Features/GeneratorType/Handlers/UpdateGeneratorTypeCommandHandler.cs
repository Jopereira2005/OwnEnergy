using AutoMapper;
using DeviceService.Application.Features.GeneratorType.Commands;
using DeviceService.Domain.Interfaces;
using MediatR;

namespace DeviceService.Application.Features.GeneratorType.Handlers;

public class UpdateGeneratorTypeCommandHandler(
    IGeneratorTypeRepository generatorTypeRepository,
    IMapper mapper
) : IRequestHandler<UpdateGeneratorTypeCommand, Unit>
{
    private readonly IGeneratorTypeRepository _generatorTypeRepository = generatorTypeRepository;
    private readonly IMapper _mapper = mapper;

    public async Task<Unit> Handle(
        UpdateGeneratorTypeCommand request,
        CancellationToken cancellationToken
    )
    {
        var generatorType =
            await _generatorTypeRepository.GetByIdAsync(request.Id)
            ?? throw new KeyNotFoundException($"Generator type with ID {request.Id} not found.");

        _mapper.Map(request, generatorType);
        generatorType.Update();

        await _generatorTypeRepository.UpdateAsync(generatorType, cancellationToken);

        return Unit.Value;
    }
}
