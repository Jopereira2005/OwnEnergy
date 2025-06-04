using DeviceService.Application.Features.Generator.Commands;
using DeviceService.Domain.Interfaces;
using MediatR;

namespace DeviceService.Application.Features.Generator.Handlers;

public class UpdateGeneratorNameCommandHandler(IGeneratorRepository generatorRepository)
    : IRequestHandler<UpdateGeneratorNameCommand>
{
    public async Task<Unit> Handle(
        UpdateGeneratorNameCommand request,
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

        generator.Name = request.Name;
        await generatorRepository.UpdateAsync(generator, cancellationToken);

        return Unit.Value;
    }
}
