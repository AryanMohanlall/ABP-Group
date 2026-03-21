using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ABPGroup.Migrations
{
    /// <inheritdoc />
    public partial class AddGenerationModeToCodeGenSessions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GenerationMode",
                table: "CodeGenSessions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RefinementHistoryJson",
                table: "CodeGenSessions",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GenerationMode",
                table: "CodeGenSessions");

            migrationBuilder.DropColumn(
                name: "RefinementHistoryJson",
                table: "CodeGenSessions");
        }
    }
}