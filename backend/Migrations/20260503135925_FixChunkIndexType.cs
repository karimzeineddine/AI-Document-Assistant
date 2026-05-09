using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI.DocumentAssistant.API.Migrations
{
    /// <inheritdoc />
    public partial class FixChunkIndexType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "ChunkIndex",
                table: "DocumentChunks",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            // Replace the auto-generated Role alteration with this:
            migrationBuilder.Sql(
                @"ALTER TABLE ""Messages"" ALTER COLUMN ""Role"" TYPE integer USING ""Role""::integer;"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "Messages",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");
        }
    }
}
