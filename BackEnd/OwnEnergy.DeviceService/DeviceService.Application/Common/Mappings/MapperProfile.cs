using AutoMapper;
using DeviceService.Application.DTOs;
using DeviceService.Application.Features.Device.Commands;
using DeviceService.Application.Features.DeviceType.Commands;
using DeviceService.Application.Features.Generator.Commands;
using DeviceService.Application.Features.GeneratorType.Commands;
using DeviceService.Domain.Entities;

namespace DeviceService.Application.Common.Mappings;

public class MapperProfile : Profile
{
    public MapperProfile()
    {
        // Mapping for Device Entity
        CreateMap<Device, UserResponseDTO>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.Intensity, opt => opt.MapFrom(src => src.Brightness))
            .ForMember(dest => dest.DeviceType, opt => opt.MapFrom(src => src.DeviceType.TypeName));

        CreateMap<Device, DeviceResponseDTO>()
            .ForMember(dest => dest.Intensity, opt => opt.MapFrom(src => src.Brightness))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.PowerWatts, opt => opt.MapFrom(src => src.PowerWatts));

        CreateMap<Device, HardwareResponseDTO>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.Brightness, opt => opt.MapFrom(src => src.Brightness));

        CreateMap<Device, CreateDeviceCommand>();
        CreateMap<CreateDeviceCommand, Device>()
            .ForMember(dest => dest.DeviceType, opt => opt.Ignore())
            .ForMember(dest => dest.DeviceActions, opt => opt.Ignore())
            .ForMember(
                dest => dest.Brightness,
                opt => opt.MapFrom(src => src.IsDimmable ? src.Brightness : null)
            );
        CreateMap<UpdateDeviceCommand, Device>();
        CreateMap<UpdateDeviceRoomCommand, Device>();
        CreateMap<UpdateDeviceGroupCommand, Device>();

        // Mapping for DeviceType Entity
        CreateMap<DeviceType, DeviceTypeResponseDTO>()
            .ReverseMap();
        CreateMap<DeviceType, CreateDeviceTypeCommand>();
        CreateMap<CreateDeviceTypeCommand, DeviceType>()
            .ForMember(dest => dest.Devices, opt => opt.Ignore());
        CreateMap<UpdateDeviceTypeCommand, DeviceType>();

        // Mapping for DeviceAction Entity
        CreateMap<DeviceAction, ActionResponseDTO>()
            .ForMember(dest => dest.Action, opt => opt.MapFrom(src => src.Action.ToString()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.PerformedAt, opt => opt.MapFrom(src => src.CreatedAt));

        CreateMap<GeneratorType, GeneratorTypeResponseDTO>().ReverseMap();
        CreateMap<CreateGeneratorTypeCommand, GeneratorType>();
        CreateMap<UpdateGeneratorTypeCommand, GeneratorType>()
            .ForMember(dest => dest.Id, opt => opt.Ignore());

        CreateMap<Generator, GeneratorResponseDTO>()
            .ForMember(
                dest => dest.GeneratorTypeName,
                opt => opt.MapFrom(src => src.GeneratorType.TypeName)
            );
        CreateMap<CreateGeneratorCommand, Generator>();
    }
}
