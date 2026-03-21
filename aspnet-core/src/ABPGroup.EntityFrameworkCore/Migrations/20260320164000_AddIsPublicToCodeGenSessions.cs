using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ABPGroup.Migrations
{
    /// <inheritdoc />
    public partial class AddIsPublicToCodeGenSessions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPublic",
                table: "CodeGenSessions",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPublic",
                table: "CodeGenSessions");
        }
    }
}