using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieRecommendationAPI.Models
{
    [Table("movies_users")]
    public class User
    {
        [Key]
        [Column("user_id")]
        public int Id { get; set; }

        [Column("name")]
        public string? Name { get; set; }

        [Column("phone")]
        public string? Phone { get; set; }

        [Column("email")]
        public string? Email { get; set; }

        [Column("age")]
        public int? Age { get; set; }

        [Column("gender")]
        public string? Gender { get; set; }

        // Streaming services
        [Column("Netflix")]
        public int? Netflix { get; set; }

        [Column("Amazon Prime")]
        public int? AmazonPrime { get; set; }

        [Column("Disney+")]
        public int? DisneyPlus { get; set; }

        [Column("Paramount+")]
        public int? ParamountPlus { get; set; }

        [Column("Max")]
        public int? Max { get; set; }

        [Column("Hulu")]
        public int? Hulu { get; set; }

        [Column("Apple TV+")]
        public int? AppleTVPlus { get; set; }

        [Column("Peacock")]
        public int? Peacock { get; set; }

        // Location
        [Column("city")]
        public string? City { get; set; }

        [Column("state")]
        public string? State { get; set; }

        [Column("zip")]
        public int? Zip { get; set; }

        // Authentication fields (not in the database)
        [NotMapped]
        public string? Password { get; set; }

        [NotMapped]
        public string? PasswordHash { get; set; }

        [NotMapped]
        public string? Role { get; set; } = "User";

        // Navigation properties
        public ICollection<Rating>? Ratings { get; set; }
    }
}
