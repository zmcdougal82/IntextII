namespace MovieRecommendationAPI.DTOs
{
    public class MovieDTO
    {
        public string Id { get; set; } = string.Empty;
        public string? Title { get; set; }
        public string? Director { get; set; }
        public string? Cast { get; set; }
        public string? Country { get; set; }
        public int? ReleaseYear { get; set; }
        public string? Rating { get; set; }
        public string? Duration { get; set; }
        public string? Description { get; set; }
        public string? Type { get; set; }
        public List<string> Genres { get; set; } = new List<string>();
        public double? AverageRating { get; set; }
    }

    public class MovieCreateDTO
    {
        public string Title { get; set; } = string.Empty;
        public string? Director { get; set; }
        public string? Cast { get; set; }
        public string? Country { get; set; }
        public int? ReleaseYear { get; set; }
        public string? Rating { get; set; }
        public string? Duration { get; set; }
        public string? Description { get; set; }
        public string? Type { get; set; }
        public List<string> Genres { get; set; } = new List<string>();
    }

    public class MovieUpdateDTO
    {
        public string? Title { get; set; }
        public string? Director { get; set; }
        public string? Cast { get; set; }
        public string? Country { get; set; }
        public int? ReleaseYear { get; set; }
        public string? Rating { get; set; }
        public string? Duration { get; set; }
        public string? Description { get; set; }
        public string? Type { get; set; }
        public List<string>? Genres { get; set; }
    }

    public class MovieFilterDTO
    {
        public string? SearchTerm { get; set; }
        public List<string>? Genres { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class MovieListResponseDTO
    {
        public List<MovieDTO> Movies { get; set; } = new List<MovieDTO>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}
