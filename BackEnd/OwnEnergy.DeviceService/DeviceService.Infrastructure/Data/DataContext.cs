using DeviceService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DeviceService.Infrastructure.Data;

public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
{
    public DbSet<Device> Devices { get; set; }
    public DbSet<DeviceAction> DeviceActions { get; set; }
    public DbSet<DeviceType> DeviceTypes { get; set; }

    public DbSet<Generator> Generators { get; set; }
    public DbSet<GeneratorType> GeneratorTypes { get; set; }

    public DbSet<EnergyRecord> EnergyRecords { get; set; }
    public DbSet<EnergyConsumptionSnapshot> EnergyConsumptionSnapshots { get; set; }
    public DbSet<EnergyGeneratedSnapshot> EnergyGeneratedSnapshots { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Device ↔ DeviceType (1:N)
        modelBuilder
            .Entity<Device>()
            .HasOne(d => d.DeviceType)
            .WithMany(dt => dt.Devices)
            .HasForeignKey(d => d.DeviceTypeId);

        // DeviceAction ↔ Device (1:N)
        modelBuilder
            .Entity<DeviceAction>()
            .HasOne(da => da.Device)
            .WithMany(d => d.DeviceActions)
            .HasForeignKey(da => da.DeviceId);

        // Generator ↔ GeneratorType (1:N)
        modelBuilder
            .Entity<Generator>()
            .HasOne(g => g.GeneratorType)
            .WithMany(gt => gt.Generators)
            .HasForeignKey(g => g.GeneratorTypeId);

        // EnergyRecord ↔ User (N:1)
        modelBuilder.Entity<EnergyRecord>().HasIndex(e => new { e.UserId, e.Date }).IsUnique();

        // EnergyConsumptionSnapshot ↔ User (N:1)
        modelBuilder
            .Entity<EnergyConsumptionSnapshot>()
            .HasIndex(e => new { e.UserId, e.Timestamp });

        // EnergyConsumptionSnapshot ↔ Device (N:1)
        modelBuilder
            .Entity<EnergyGeneratedSnapshot>()
            .HasIndex(e => new { e.UserId, e.Timestamp });

        base.OnModelCreating(modelBuilder);
    }
}
