using DeviceService.Application.Common.Services.Interfaces;
using DeviceService.Application.Features.Generator.Commands;
using DeviceService.Domain.Interfaces;
using MediatR;

namespace DeviceService.Application.Features.Generator.Handlers;

public class DeactivateGeneratorCommandHandler(
    IGeneratorRepository generatorRepository,
    IGeneratorSnapshotService snapshotService
) : IRequestHandler<DeactivateGeneratorCommand>
{
    public async Task<Unit> Handle(
        DeactivateGeneratorCommand request,
        CancellationToken cancellationToken
    )
    {
        var generator =
            await generatorRepository.GetByIdAsync(request.Id)
            ?? throw new KeyNotFoundException("Gerador não encontrado.");

        if (generator.UserId != request.UserId)
            throw new UnauthorizedAccessException(
                "Este gerador não pertence ao usuário autenticado."
            );

        var now = DateTime.UtcNow;

        // Gera snapshot antes de desativar (última sessão em andamento)
        if (generator.IsCurrentlyActive)
        {
            await snapshotService.GenerateSnapshotForGeneratorAsync(
                generator,
                now,
                cancellationToken
            );
        }

        generator.Deactivate(now);
        await generatorRepository.UpdateAsync(generator, cancellationToken);

        return Unit.Value;
    }
}
