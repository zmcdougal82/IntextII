using Microsoft.EntityFrameworkCore;
using MovieRecommendationAPI.Models;

namespace MovieRecommendationAPI.Data
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure any user-specific model constraints
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
                
            // Ignore navigation properties to avoid issues with Rating entity
            modelBuilder.Entity<User>()
                .Ignore(u => u.Ratings);
        }
    }
}
