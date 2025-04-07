namespace MovieRecommendationAPI.DTOs
{
    public class RegisterDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public int? Zip { get; set; }
        
        // Streaming services
        public bool Netflix { get; set; }
        public bool AmazonPrime { get; set; }
        public bool DisneyPlus { get; set; }
        public bool ParamountPlus { get; set; }
        public bool Max { get; set; }
        public bool Hulu { get; set; }
        public bool AppleTVPlus { get; set; }
        public bool Peacock { get; set; }
    }

    public class LoginDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}
