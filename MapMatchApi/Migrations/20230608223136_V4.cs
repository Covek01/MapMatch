using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MapMatchApi.Migrations
{
    /// <inheritdoc />
    public partial class V4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LocationSharing_RegisteredUsers_SharedFromId",
                table: "LocationSharing");

            migrationBuilder.DropForeignKey(
                name: "FK_LocationSharing_RegisteredUsers_SharedToId",
                table: "LocationSharing");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LocationSharing",
                table: "LocationSharing");

            migrationBuilder.RenameTable(
                name: "LocationSharing",
                newName: "LocationSharings");

            migrationBuilder.RenameIndex(
                name: "IX_LocationSharing_SharedToId",
                table: "LocationSharings",
                newName: "IX_LocationSharings_SharedToId");

            migrationBuilder.RenameIndex(
                name: "IX_LocationSharing_SharedFromId",
                table: "LocationSharings",
                newName: "IX_LocationSharings_SharedFromId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LocationSharings",
                table: "LocationSharings",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LocationSharings_RegisteredUsers_SharedFromId",
                table: "LocationSharings",
                column: "SharedFromId",
                principalTable: "RegisteredUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LocationSharings_RegisteredUsers_SharedToId",
                table: "LocationSharings",
                column: "SharedToId",
                principalTable: "RegisteredUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LocationSharings_RegisteredUsers_SharedFromId",
                table: "LocationSharings");

            migrationBuilder.DropForeignKey(
                name: "FK_LocationSharings_RegisteredUsers_SharedToId",
                table: "LocationSharings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LocationSharings",
                table: "LocationSharings");

            migrationBuilder.RenameTable(
                name: "LocationSharings",
                newName: "LocationSharing");

            migrationBuilder.RenameIndex(
                name: "IX_LocationSharings_SharedToId",
                table: "LocationSharing",
                newName: "IX_LocationSharing_SharedToId");

            migrationBuilder.RenameIndex(
                name: "IX_LocationSharings_SharedFromId",
                table: "LocationSharing",
                newName: "IX_LocationSharing_SharedFromId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LocationSharing",
                table: "LocationSharing",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LocationSharing_RegisteredUsers_SharedFromId",
                table: "LocationSharing",
                column: "SharedFromId",
                principalTable: "RegisteredUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LocationSharing_RegisteredUsers_SharedToId",
                table: "LocationSharing",
                column: "SharedToId",
                principalTable: "RegisteredUsers",
                principalColumn: "Id");
        }
    }
}
