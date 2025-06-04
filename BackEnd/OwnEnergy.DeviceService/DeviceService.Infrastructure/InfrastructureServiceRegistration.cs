using DeviceService.Domain.Interfaces;
using DeviceService.Infrastructure.Data;
using DeviceService.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DeviceService.Infrastructure;

public static class InfrastructureServiceRegistration
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddScoped<IDeviceRepository, DeviceRepository>();
        services.AddScoped<IDeviceTypeRepository, DeviceTypeRepository>();
        services.AddScoped<IDeviceActionRepository, DeviceActionRepository>();
        services.AddScoped<IGeneratorTypeRepository, GeneratorTypeRepository>();
        services.AddScoped<IGeneratorRepository, GeneratorRepository>();
        services.AddScoped<IEnergyRecordRepository, EnergyRecordRepository>();
        services.AddScoped<
            IEnergyConsumptionSnapshotRepository,
            EnergyConsumptionSnapshotRepository
        >();
        services.AddScoped<IEnergyGeneratedSnapshotRepository, EnergyGeneratedSnapshotRepository>();
        services.AddDbContext<DataContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
        );

        return services;
    }
}
