using AutoMapper;
using DeviceService.Application.DTOs;
using DeviceService.Application.Features.Device.Queries;
using DeviceService.Domain.Interfaces;
using MediatR;

namespace DeviceService.Application.Features.Device.Handlers.QueryHandlers;

public class GetAllDevicesQueryHandler(IDeviceRepository deviceRepository, IMapper mapper)
    : IRequestHandler<GetAllDevicesQuery, PaginatedResultDTO<DeviceResponseDTO>>
{
    private readonly IDeviceRepository _deviceRepository = deviceRepository;
    private readonly IMapper _mapper = mapper;

    public async Task<PaginatedResultDTO<DeviceResponseDTO>> Handle(
        GetAllDevicesQuery request,
        CancellationToken cancellationToken
    )
    {
        var devices = await _deviceRepository.GetAllAsync(
            request.Page,
            request.PageSize,
            orderBy: d => d.Name,
            ascending: true,
            cancellationToken: cancellationToken
        );
        var totalCount = await _deviceRepository.CountAsync();
        var devicesResponse = _mapper.Map<IEnumerable<DeviceResponseDTO>>(devices);

        return new PaginatedResultDTO<DeviceResponseDTO>(
            totalCount,
            request.Page,
            request.PageSize,
            devicesResponse
        );
    }
}
