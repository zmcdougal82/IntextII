namespace MovieRecommendationAPI.DTOs
{
    public class RatingDTO
    {
        public int UserId { get; set; }
        public string MovieId { get; set; } = string.Empty;
        public int Value { get; set; }
        public string? MovieTitle { get; set; }
    }

    public class RatingCreateDTO
    {
        public string MovieId { get; set; } = string.Empty;
        public int Value { get; set; }
    }

    public class RatingUpdateDTO
    {
        public int Value { get; set; }
    }

    public class UserRatingsResponseDTO
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public List<RatingDTO> Ratings { get; set; } = new List<RatingDTO>();
    }
}
