using AutoMapper;
using DeviceService.Application.Features.Generator.Commands;
using DeviceService.Domain.Interfaces;
using MediatR;
using Entity = DeviceService.Domain.Entities;

namespace DeviceService.Application.Features.Generator.Handlers;

public class CreateGeneratorCommandHandler(
    IGeneratorRepository generatorRepository,
    IGeneratorTypeRepository generatorTypeRepository,
    IMapper mapper
) : IRequestHandler<CreateGeneratorCommand, Guid>
{
    private readonly IGeneratorRepository _generatorRepository = generatorRepository;
    private readonly IGeneratorTypeRepository _generatorTypeRepository = generatorTypeRepository;
    private readonly IMapper _mapper = mapper;

    public async Task<Guid> Handle(
        CreateGeneratorCommand request,
        CancellationToken cancellationToken
    )
    {
        // Busca o tipo de gerador com nome fixo "Painel Solar"
        var generatorType =
            await _generatorTypeRepository.GetGeneratorTypeByNameAsync(
                "Painel Solar",
                cancellationToken
            )
            ?? throw new InvalidOperationException(
                "Tipo de gerador 'Painel Solar' não foi encontrado."
            );

        var generator = _mapper.Map<Entity.Generator>(request);

        // Força os valores corretos na entidade
        generator.GeneratorTypeId = generatorType.Id;

        await _generatorRepository.CreateAsync(generator, cancellationToken);
        return generator.Id;
    }
}
