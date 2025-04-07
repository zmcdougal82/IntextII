using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieRecommendationAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialUserDbCreation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "movies_users",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    name = table.Column<string>(type: "TEXT", nullable: true),
                    phone = table.Column<string>(type: "TEXT", nullable: true),
                    email = table.Column<string>(type: "TEXT", nullable: true),
                    age = table.Column<int>(type: "INTEGER", nullable: true),
                    gender = table.Column<string>(type: "TEXT", nullable: true),
                    Netflix = table.Column<int>(type: "INTEGER", nullable: true),
                    AmazonPrime = table.Column<int>(name: "Amazon Prime", type: "INTEGER", nullable: true),
                    Disney = table.Column<int>(name: "Disney+", type: "INTEGER", nullable: true),
                    Paramount = table.Column<int>(name: "Paramount+", type: "INTEGER", nullable: true),
                    Max = table.Column<int>(type: "INTEGER", nullable: true),
                    Hulu = table.Column<int>(type: "INTEGER", nullable: true),
                    AppleTV = table.Column<int>(name: "Apple TV+", type: "INTEGER", nullable: true),
                    Peacock = table.Column<int>(type: "INTEGER", nullable: true),
                    city = table.Column<string>(type: "TEXT", nullable: true),
                    state = table.Column<string>(type: "TEXT", nullable: true),
                    zip = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_movies_users", x => x.user_id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_movies_users_email",
                table: "movies_users",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "movies_users");
        }
    }
}
