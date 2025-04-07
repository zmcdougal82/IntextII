using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieRecommendationAPI.Models
{
    [Table("movies_ratings")]
    public class Rating
    {
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("show_id")]
        public string MovieId { get; set; } = string.Empty;

        [Column("rating")]
        public int Value { get; set; }

        [Column("timestamp")]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public User? User { get; set; }
        
        [ForeignKey("MovieId")]
        public Movie? Movie { get; set; }
    }
}
