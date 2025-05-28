using DeviceService.Application.Common.Services.Interfaces;
using DeviceService.Domain.Entities;
using DeviceService.Domain.Interfaces;

namespace DeviceService.Application.Common.Services;

public class GeneratorSnapshotService(
    IGeneratorRepository generatorRepository,
    IEnergyGeneratedSnapshotRepository snapshotRepository
) : IGeneratorSnapshotService
{
    private readonly IGeneratorRepository _generatorRepository = generatorRepository;
    private readonly IEnergyGeneratedSnapshotRepository _snapshotRepository = snapshotRepository;

    public async Task GenerateSnapshotForGeneratorAsync(
        Generator generator,
        DateTime timestamp,
        CancellationToken cancellationToken = default
    )
    {
        if (!generator.IsCurrentlyActive || generator.LastActivatedAt is null)
            return;

        var duration = timestamp - generator.LastActivatedAt.Value;
        var energy = generator.GetCurrentSessionEnergyKWh(timestamp);

        var snapshot = BuildSnapshot(
            generator.UserId,
            generator.Id,
            timestamp,
            duration,
            energy,
            "Gerado automaticamente ao controlar gerador"
        );

        await _snapshotRepository.CreateAsync(snapshot, cancellationToken);
    }

    public async Task GenerateSnapshotForUserAsync(
        Guid userId,
        DateTime timestamp,
        CancellationToken cancellationToken = default
    )
    {
        var generators = await _generatorRepository.GetActiveGeneratorsAsync(
            userId,
            cancellationToken
        );

        if (!generators.Any())
            return;

        var totalDuration = TimeSpan.Zero;
        double totalEnergy = 0;

        foreach (
            var gen in generators.Where(g => g.IsCurrentlyActive && g.LastActivatedAt is not null)
        )
        {
            totalDuration += timestamp - gen.LastActivatedAt!.Value;
            totalEnergy += gen.GetCurrentSessionEnergyKWh(timestamp);
        }

        var snapshot = BuildSnapshot(
            userId,
            null,
            timestamp,
            totalDuration,
            totalEnergy,
            "Gerado automaticamente ao controlar geradores"
        );

        await _snapshotRepository.CreateAsync(snapshot, cancellationToken);
    }

    private static EnergyGeneratedSnapshot BuildSnapshot(
        Guid userId,
        Guid? generatorId,
        DateTime timestamp,
        TimeSpan sessionDuration,
        double energyGeneratedKWh,
        string notes
    )
    {
        return new EnergyGeneratedSnapshot
        {
            UserId = userId,
            GeneratorId = generatorId,
            Timestamp = timestamp,
            SessionDuration = sessionDuration,
            EnergyGeneratedKWh = (float)energyGeneratedKWh,
            Notes = notes,
        };
    }
}
