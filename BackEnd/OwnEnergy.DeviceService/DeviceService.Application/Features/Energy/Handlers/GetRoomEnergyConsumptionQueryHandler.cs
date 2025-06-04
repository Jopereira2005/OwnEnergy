using DeviceService.Application.Common.Services.Interfaces;
using DeviceService.Application.DTOs;
using DeviceService.Application.Features.Energy.Queries;
using DeviceService.Domain.Interfaces;
using MediatR;

namespace DeviceService.Application.Features.Energy.Handlers;

public class GetRoomEnergyConsumptionQueryHandler(
    IDeviceRepository deviceRepository,
    IEnergyConsumptionSnapshotRepository snapshotRepository,
    IDeviceSnapshotService snapshotService
) : IRequestHandler<GetRoomEnergyConsumptionQuery, RoomEnergyConsumptionResponseDTOList>
{
    private readonly IDeviceRepository _deviceRepository = deviceRepository;
    private readonly IEnergyConsumptionSnapshotRepository _snapshotRepository = snapshotRepository;
    private readonly IDeviceSnapshotService _snapshotService = snapshotService;

    public async Task<RoomEnergyConsumptionResponseDTOList> Handle(
        GetRoomEnergyConsumptionQuery request,
        CancellationToken cancellationToken
    )
    {
        var userId = request.UserId;
        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var roomIds = await _deviceRepository.GetUserDevicesRoomIdsAsync(userId, cancellationToken);

        var result = new List<RoomEnergyConsumptionResponseDTO>();
        float total = 0;

        foreach (var roomId in roomIds)
        {
            await _snapshotService.GenerateSnapshotForRoomAsync(
                userId,
                roomId,
                now,
                cancellationToken
            );

            var snapshots = await _snapshotRepository.GetSnapshotsByRoomIdAsync(
                userId,
                roomId,
                startOfMonth,
                now,
                cancellationToken
            );

            var energy = snapshots.Sum(s => s.EnergyConsumedKWh);
            total += energy;

            result.Add(
                new RoomEnergyConsumptionResponseDTO { RoomId = roomId, EnergyConsumption = energy }
            );
        }

        foreach (var dto in result)
        {
            dto.PercentageOfTotal =
                total > 0 ? (int)Math.Round((dto.EnergyConsumption / total) * 100) : 0;
        }

        return new RoomEnergyConsumptionResponseDTOList { RoomEnergyConsumptions = result };
    }
}
