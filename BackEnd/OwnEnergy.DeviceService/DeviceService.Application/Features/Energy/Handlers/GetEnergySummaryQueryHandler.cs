using DeviceService.Application.Common.Services.Interfaces;
using DeviceService.Application.DTOs;
using DeviceService.Application.Features.Energy.Queries;
using DeviceService.Domain.Interfaces;
using MediatR;

namespace DeviceService.Application.Features.Energy.Handlers;

public class GetEnergySummaryQueryHandler(
    IEnergyConsumptionSnapshotRepository consumptionRepo,
    IEnergyGeneratedSnapshotRepository generationRepo,
    IDeviceSnapshotService deviceSnapshotService,
    IGeneratorSnapshotService generatorSnapshotService
) : IRequestHandler<GetEnergySummaryQuery, EnergyResponseDTO>
{
    private readonly IEnergyConsumptionSnapshotRepository _consumptionRepo = consumptionRepo;
    private readonly IEnergyGeneratedSnapshotRepository _generationRepo = generationRepo;
    private readonly IDeviceSnapshotService _deviceSnapshotService = deviceSnapshotService;
    private readonly IGeneratorSnapshotService _generatorSnapshotService = generatorSnapshotService;

    public async Task<EnergyResponseDTO> Handle(
        GetEnergySummaryQuery request,
        CancellationToken cancellationToken
    )
    {
        var now = DateTime.UtcNow;

        // Atualiza snapshots com base nas sessões em andamento
        await _deviceSnapshotService.GenerateSnapshotForUserAsync(
            request.UserId,
            now,
            cancellationToken
        );
        await _generatorSnapshotService.GenerateSnapshotForUserAsync(
            request.UserId,
            now,
            cancellationToken
        );

        var startOfDay = DateTime.SpecifyKind(now.Date, DateTimeKind.Utc);
        var startOfWeek = DateTime.SpecifyKind(now.AddDays(-6).Date, DateTimeKind.Utc);
        var startOfMonth = DateTime.SpecifyKind(
            new DateTime(now.Year, now.Month, 1),
            DateTimeKind.Utc
        );
        var startOfYear = DateTime.SpecifyKind(new DateTime(now.Year, 1, 1), DateTimeKind.Utc);

        return new EnergyResponseDTO
        {
            Daily = await GetPeriodAsync(request.UserId, startOfDay, now, cancellationToken),
            Weekly = await GetPeriodAsync(request.UserId, startOfWeek, now, cancellationToken),
            Monthly = await GetPeriodAsync(request.UserId, startOfMonth, now, cancellationToken),
            Yearly = await GetPeriodAsync(request.UserId, startOfYear, now, cancellationToken),
        };
    }

    private async Task<EnergyPeriodDto> GetPeriodAsync(
        Guid userId,
        DateTime from,
        DateTime to,
        CancellationToken cancellationToken
    )
    {
        var consumedSnapshots = await _consumptionRepo.GetSnapshotsByUserIdAsync(
            userId,
            from,
            to,
            cancellationToken
        );

        var generatedSnapshots = await _generationRepo.GetSnapshotsByUserIdAsync(
            userId,
            from,
            to,
            cancellationToken
        );

        consumedSnapshots = consumedSnapshots
            .Where(s => s.DeviceId is null && s.RoomId is null)
            .ToList();

        generatedSnapshots = generatedSnapshots.Where(s => s.GeneratorId is null).ToList();

        return new EnergyPeriodDto
        {
            From = from,
            To = to,
            EnergyConsumedKWh = consumedSnapshots.Sum(s => s.EnergyConsumedKWh),
            EnergyGeneratedKWh = generatedSnapshots.Sum(s => s.EnergyGeneratedKWh),
        };
    }
}
