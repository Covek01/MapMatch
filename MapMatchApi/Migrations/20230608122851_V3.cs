using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MapMatchApi.Migrations
{
    /// <inheritdoc />
    public partial class V3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InvitedToJoinGroupId",
                table: "Requests",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "RegisteredUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "LocationSharing",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SharedToId = table.Column<int>(type: "int", nullable: true),
                    SharedFromId = table.Column<int>(type: "int", nullable: true),
                    timeOfShare = table.Column<DateTime>(type: "datetime2", nullable: false),
                    durationInMinutes = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocationSharing", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LocationSharing_RegisteredUsers_SharedFromId",
                        column: x => x.SharedFromId,
                        principalTable: "RegisteredUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_LocationSharing_RegisteredUsers_SharedToId",
                        column: x => x.SharedToId,
                        principalTable: "RegisteredUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Requests_InvitedToJoinGroupId",
                table: "Requests",
                column: "InvitedToJoinGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_LocationSharing_SharedFromId",
                table: "LocationSharing",
                column: "SharedFromId");

            migrationBuilder.CreateIndex(
                name: "IX_LocationSharing_SharedToId",
                table: "LocationSharing",
                column: "SharedToId");

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_Groups_InvitedToJoinGroupId",
                table: "Requests",
                column: "InvitedToJoinGroupId",
                principalTable: "Groups",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Requests_Groups_InvitedToJoinGroupId",
                table: "Requests");

            migrationBuilder.DropTable(
                name: "LocationSharing");

            migrationBuilder.DropIndex(
                name: "IX_Requests_InvitedToJoinGroupId",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "InvitedToJoinGroupId",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "RegisteredUsers");
        }
    }
}
