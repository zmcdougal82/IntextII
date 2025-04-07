using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieRecommendationAPI.Data;
using MovieRecommendationAPI.DTOs;
using MovieRecommendationAPI.Models;
using System.Security.Claims;

namespace MovieRecommendationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RatingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RatingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Ratings
        [HttpGet]
        public async Task<ActionResult<UserRatingsResponseDTO>> GetUserRatings()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found");
            }

            var ratings = await _context.Ratings
                .Where(r => r.UserId == userId)
                .Include(r => r.Movie)
                .ToListAsync();

            var ratingDTOs = ratings.Select(r => new RatingDTO
            {
                UserId = r.UserId,
                MovieId = r.MovieId,
                Value = r.Value,
                MovieTitle = r.Movie?.Title
            }).ToList();

            return Ok(new UserRatingsResponseDTO
            {
                UserId = userId,
                UserName = user.Name ?? string.Empty,
                Ratings = ratingDTOs
            });
        }

        // GET: api/Ratings/5
        [HttpGet("{movieId}")]
        public async Task<ActionResult<RatingDTO>> GetRating(string movieId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var rating = await _context.Ratings
                .Include(r => r.Movie)
                .FirstOrDefaultAsync(r => r.UserId == userId && r.MovieId == movieId);

            if (rating == null)
            {
                return NotFound();
            }

            return new RatingDTO
            {
                UserId = rating.UserId,
                MovieId = rating.MovieId,
                Value = rating.Value,
                MovieTitle = rating.Movie?.Title
            };
        }

        // POST: api/Ratings
        [HttpPost]
        public async Task<ActionResult<RatingDTO>> CreateRating(RatingCreateDTO ratingDTO)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            // Check if movie exists
            var movie = await _context.Movies.FindAsync(ratingDTO.MovieId);
            if (movie == null)
            {
                return BadRequest("Movie not found");
            }

            // Check if rating already exists
            var existingRating = await _context.Ratings
                .FirstOrDefaultAsync(r => r.UserId == userId && r.MovieId == ratingDTO.MovieId);

            if (existingRating != null)
            {
                return BadRequest("Rating already exists. Use PUT to update.");
            }

            var rating = new Rating
            {
                UserId = userId,
                MovieId = ratingDTO.MovieId,
                Value = ratingDTO.Value
            };

            _context.Ratings.Add(rating);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRating), new { movieId = rating.MovieId }, new RatingDTO
            {
                UserId = rating.UserId,
                MovieId = rating.MovieId,
                Value = rating.Value,
                MovieTitle = movie.Title
            });
        }

        // PUT: api/Ratings/5
        [HttpPut("{movieId}")]
        public async Task<IActionResult> UpdateRating(string movieId, RatingUpdateDTO ratingDTO)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var rating = await _context.Ratings
                .FirstOrDefaultAsync(r => r.UserId == userId && r.MovieId == movieId);

            if (rating == null)
            {
                return NotFound();
            }

            rating.Value = ratingDTO.Value;

            _context.Entry(rating).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RatingExists(userId, movieId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Ratings/5
        [HttpDelete("{movieId}")]
        public async Task<IActionResult> DeleteRating(string movieId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var rating = await _context.Ratings
                .FirstOrDefaultAsync(r => r.UserId == userId && r.MovieId == movieId);

            if (rating == null)
            {
                return NotFound();
            }

            _context.Ratings.Remove(rating);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RatingExists(int userId, string movieId)
        {
            return _context.Ratings.Any(e => e.UserId == userId && e.MovieId == movieId);
        }
    }
}
