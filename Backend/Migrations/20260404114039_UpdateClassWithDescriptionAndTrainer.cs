using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gymbackend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateClassWithDescriptionAndTrainer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "ClassSchedules",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_ClassSchedules_TrainerId",
                table: "ClassSchedules",
                column: "TrainerId");

            migrationBuilder.AddForeignKey(
                name: "FK_ClassSchedules_Users_TrainerId",
                table: "ClassSchedules",
                column: "TrainerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClassSchedules_Users_TrainerId",
                table: "ClassSchedules");

            migrationBuilder.DropIndex(
                name: "IX_ClassSchedules_TrainerId",
                table: "ClassSchedules");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "ClassSchedules");
        }
    }
}
