using DeviceService.Application.Features.Generator.Commands;
using DeviceService.Domain.Interfaces;
using MediatR;

namespace DeviceService.Application.Features.Generator.Handlers;

public class UpdateGeneratorPowerRateCommandHandler(IGeneratorRepository generatorRepository)
    : IRequestHandler<UpdateGeneratorPowerRateCommand, Unit>
{
    private readonly IGeneratorRepository _generatorRepository = generatorRepository;

    public async Task<Unit> Handle(
        UpdateGeneratorPowerRateCommand request,
        CancellationToken cancellationToken
    )
    {
        var generator =
            await _generatorRepository.GetByIdAsync(request.Id)
            ?? throw new KeyNotFoundException($"Generator with ID {request.Id} not found.");

        generator.GenerationRateWattsPerHour = request.GenerationRateWattsPerHour;

        await _generatorRepository.UpdateAsync(generator, cancellationToken);

        return Unit.Value;
    }
}
