using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieRecommendationAPI.Migrations.ApplicationDb
{
    /// <inheritdoc />
    public partial class AddAuthColumnsToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "poster_url",
                table: "movies_titles",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_movies_users_email",
                table: "movies_users",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_movies_users_email",
                table: "movies_users");

            migrationBuilder.DropColumn(
                name: "poster_url",
                table: "movies_titles");
        }
    }
}
