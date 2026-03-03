using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FirstApp.WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class PhotoApprovalByAdminOrModerators : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "isApproved",
                table: "Photos",
                newName: "IsApproved");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsApproved",
                table: "Photos",
                newName: "isApproved");
        }
    }
}
