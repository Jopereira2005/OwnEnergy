using DeviceService.Application.Features.Generator.Commands;
using DeviceService.Domain.Interfaces;
using MediatR;

namespace DeviceService.Application.Features.Generator.Handlers;

public class ActivateGeneratorCommandHandler(IGeneratorRepository generatorRepository)
    : IRequestHandler<ActivateGeneratorCommand>
{
    public async Task<Unit> Handle(
        ActivateGeneratorCommand request,
        CancellationToken cancellationToken
    )
    {
        var generator =
            await generatorRepository.GetByIdAsync(request.Id)
            ?? throw new KeyNotFoundException("Gerador não encontrado.");

        if (generator.UserId != request.UserId)
            throw new UnauthorizedAccessException("Este gerador não pertence ao usuário.");

        if (generator.IsActive)
            return Unit.Value;

        generator.Activate(DateTime.UtcNow);
        await generatorRepository.UpdateAsync(generator, cancellationToken);

        return Unit.Value;
    }
}
