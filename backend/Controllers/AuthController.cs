using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MovieRecommendationAPI.Data;
using MovieRecommendationAPI.DTOs;
using MovieRecommendationAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace MovieRecommendationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDTO>> Register(RegisterDTO registerDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return BadRequest("User with this email already exists.");
            }

            string passwordHash = CreatePasswordHash(registerDto.Password);

            var user = new User
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                Phone = registerDto.Phone,
                Age = registerDto.Age,
                Gender = registerDto.Gender,
                City = registerDto.City,
                State = registerDto.State,
                Zip = registerDto.Zip,
                Netflix = registerDto.Netflix ? 1 : 0,
                AmazonPrime = registerDto.AmazonPrime ? 1 : 0,
                DisneyPlus = registerDto.DisneyPlus ? 1 : 0,
                ParamountPlus = registerDto.ParamountPlus ? 1 : 0,
                Max = registerDto.Max ? 1 : 0,
                Hulu = registerDto.Hulu ? 1 : 0,
                AppleTVPlus = registerDto.AppleTVPlus ? 1 : 0,
                Peacock = registerDto.Peacock ? 1 : 0,
                PasswordHash = passwordHash,
                Role = "User"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = CreateToken(user);

            return Ok(new AuthResponseDTO
            {
                Id = user.Id,
                Name = user.Name ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Token = token,
                Role = user.Role ?? "User"
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDTO>> Login(LoginDTO loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            if (!VerifyPasswordHash(loginDto.Password, user.PasswordHash ?? string.Empty))
            {
                return BadRequest("Wrong password.");
            }

            var token = CreateToken(user);

            return Ok(new AuthResponseDTO
            {
                Id = user.Id,
                Name = user.Name ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Token = token,
                Role = user.Role ?? "User"
            });
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name ?? string.Empty),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Role, user.Role ?? "User")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("JwtSettings:Secret").Value ?? "defaultsecretkey12345678901234567890"));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddMinutes(Convert.ToDouble(_configuration.GetSection("JwtSettings:ExpiryMinutes").Value ?? "60")),
                SigningCredentials = creds,
                Issuer = _configuration.GetSection("JwtSettings:Issuer").Value,
                Audience = _configuration.GetSection("JwtSettings:Audience").Value
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        private string CreatePasswordHash(string password)
        {
            using (var hmac = new HMACSHA512())
            {
                var passwordSalt = hmac.Key;
                var passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                
                // Combine salt and hash into a single string
                // Format: {salt}:{hash}
                return $"{Convert.ToBase64String(passwordSalt)}:{Convert.ToBase64String(passwordHash)}";
            }
        }

        private bool VerifyPasswordHash(string password, string storedHashString)
        {
            // Extract salt and hash from the combined string
            var parts = storedHashString.Split(':');
            if (parts.Length != 2)
                return false;
                
            var salt = Convert.FromBase64String(parts[0]);
            var hash = Convert.FromBase64String(parts[1]);
            
            // Use the stored salt to compute the hash
            using (var hmac = new HMACSHA512(salt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                
                // Compare the computed hash with the stored hash
                if (computedHash.Length != hash.Length)
                    return false;
                
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != hash[i])
                        return false;
                }
                
                return true;
            }
        }
    }
}
