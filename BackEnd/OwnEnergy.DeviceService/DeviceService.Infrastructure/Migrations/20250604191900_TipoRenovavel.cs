using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DeviceService.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class TipoRenovavel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "GeneratorTypes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsRenewable",
                table: "GeneratorTypes",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "GeneratorTypes");

            migrationBuilder.DropColumn(
                name: "IsRenewable",
                table: "GeneratorTypes");
        }
    }
}
