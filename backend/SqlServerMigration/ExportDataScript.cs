using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MovieRecommendationAPI.Data;
using MovieRecommendationAPI.Models;
using System.Linq;
using System.Collections.Generic;
using System.Text;

namespace MovieRecommendationAPI.SqlServerMigration
{
    public class DataMigrationTool
    {
        public static async Task Main(string[] args)
        {
            Console.WriteLine("Starting SQLite to SQL Server data migration...");

            // Step 1: Set up configuration from appsettings.json
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .Build();

            // Step 2: Create SQLite connection
            var sqliteConnectionString = "Data Source=NewMovies.db";
            var sqliteOptionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            sqliteOptionsBuilder.UseSqlite(sqliteConnectionString);

            // Step 3: Extract data from SQLite
            Console.WriteLine("Extracting data from SQLite database...");
            List<Movie> movies = new List<Movie>();
            List<User> users = new List<User>();
            List<Rating> ratings = new List<Rating>();

            using (var sqliteContext = new ApplicationDbContext(sqliteOptionsBuilder.Options))
            {
                movies = await sqliteContext.Movies.ToListAsync();
                users = await sqliteContext.Users.ToListAsync();
                ratings = await sqliteContext.Ratings.ToListAsync();
            }

            Console.WriteLine($"Extracted {movies.Count} movies, {users.Count} users, and {ratings.Count} ratings.");

            // Step 4: Generate SQL Server scripts
            Console.WriteLine("Generating SQL Server scripts...");
            var outputDir = "SqlServerMigration/Output";
            Directory.CreateDirectory(outputDir);

            // Generate Movies insert script
            StringBuilder moviesScript = new StringBuilder();
            moviesScript.AppendLine("-- Movies Table Insert Script");
            moviesScript.AppendLine("INSERT INTO Movies (MovieId, Title, ReleaseYear, Genre, Director, StarRating, Duration, Rating, Plot, MoviePoster) VALUES");
            
            for (int i = 0; i < movies.Count; i++)
            {
                var movie = movies[i];
                moviesScript.Append($"({movie.MovieId}, '{EscapeSql(movie.Title)}', {movie.ReleaseYear}, '{EscapeSql(movie.Genre)}', '{EscapeSql(movie.Director)}', {movie.StarRating}, {movie.Duration}, '{EscapeSql(movie.Rating)}', '{EscapeSql(movie.Plot)}', '{EscapeSql(movie.MoviePoster)}')");
                
                if (i < movies.Count - 1)
                    moviesScript.AppendLine(",");
                else
                    moviesScript.AppendLine(";");
            }
            
            File.WriteAllText(Path.Combine(outputDir, "01_Movies.sql"), moviesScript.ToString());

            // Generate Users insert script
            StringBuilder usersScript = new StringBuilder();
            usersScript.AppendLine("-- Users Table Insert Script");
            usersScript.AppendLine("INSERT INTO Users (Id, Name, Email, Phone, Age, Gender, City, State, Zip, Netflix, AmazonPrime, DisneyPlus, ParamountPlus, Max, Hulu, AppleTVPlus, Peacock, PasswordHash, Role) VALUES");
            
            for (int i = 0; i < users.Count; i++)
            {
                var user = users[i];
                usersScript.Append($"({user.Id}, '{EscapeSql(user.Name)}', '{EscapeSql(user.Email)}', '{EscapeSql(user.Phone)}', {user.Age}, '{EscapeSql(user.Gender)}', '{EscapeSql(user.City)}', '{EscapeSql(user.State)}', '{EscapeSql(user.Zip)}', {user.Netflix}, {user.AmazonPrime}, {user.DisneyPlus}, {user.ParamountPlus}, {user.Max}, {user.Hulu}, {user.AppleTVPlus}, {user.Peacock}, '{EscapeSql(user.PasswordHash)}', '{EscapeSql(user.Role)}')");
                
                if (i < users.Count - 1)
                    usersScript.AppendLine(",");
                else
                    usersScript.AppendLine(";");
            }
            
            File.WriteAllText(Path.Combine(outputDir, "02_Users.sql"), usersScript.ToString());

            // Generate Ratings insert script
            StringBuilder ratingsScript = new StringBuilder();
            ratingsScript.AppendLine("-- Ratings Table Insert Script");
            ratingsScript.AppendLine("INSERT INTO Ratings (UserId, MovieId, RatingValue, RatingDate) VALUES");
            
            for (int i = 0; i < ratings.Count; i++)
            {
                var rating = ratings[i];
                ratingsScript.Append($"({rating.UserId}, {rating.MovieId}, {rating.RatingValue}, '{rating.RatingDate.ToString("yyyy-MM-dd HH:mm:ss")}')");
                
                if (i < ratings.Count - 1)
                    ratingsScript.AppendLine(",");
                else
                    ratingsScript.AppendLine(";");
            }
            
            File.WriteAllText(Path.Combine(outputDir, "03_Ratings.sql"), ratingsScript.ToString());

            Console.WriteLine($"SQL Server scripts generated in {outputDir} directory.");
            Console.WriteLine("Data migration preparation complete!");
        }

        private static string EscapeSql(string input)
        {
            if (string.IsNullOrEmpty(input))
                return "";
                
            return input.Replace("'", "''");
        }
    }
}
