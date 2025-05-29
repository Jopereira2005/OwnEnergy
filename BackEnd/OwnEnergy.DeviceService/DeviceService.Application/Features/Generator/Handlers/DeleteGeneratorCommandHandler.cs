using DeviceService.Application.Features.Generator.Commands;
using DeviceService.Domain.Interfaces;
using MediatR;

namespace DeviceService.Application.Features.Generator.Handlers;

public class DeleteGeneratorCommandHandler(IGeneratorRepository generatorRepository)
    : IRequestHandler<DeleteGeneratorCommand>
{
    public async Task<Unit> Handle(
        DeleteGeneratorCommand request,
        CancellationToken cancellationToken
    )
    {
        var generator = await generatorRepository.GetByIdAsync(request.Id);
        if (generator is null)
            throw new KeyNotFoundException("Gerador não encontrado.");

        if (generator.UserId != request.UserId)
            throw new UnauthorizedAccessException(
                "Este gerador não pertence ao usuário autenticado."
            );

        await generatorRepository.DeleteAsync(request.Id, cancellationToken);
        return Unit.Value;
    }
}
