using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI.DocumentAssistant.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDocumentChunks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmbeddingId",
                table: "DocumentChunks");

            migrationBuilder.AddColumn<int>(
                name: "ChunkIndex",
                table: "DocumentChunks",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChunkIndex",
                table: "DocumentChunks");

            migrationBuilder.AddColumn<string>(
                name: "EmbeddingId",
                table: "DocumentChunks",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
