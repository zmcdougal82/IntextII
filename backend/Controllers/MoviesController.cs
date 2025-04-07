using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieRecommendationAPI.Data;
using MovieRecommendationAPI.DTOs;
using MovieRecommendationAPI.Models;
using System.Reflection;

namespace MovieRecommendationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MoviesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Movies
        [HttpGet]
        public async Task<ActionResult<MovieListResponseDTO>> GetMovies([FromQuery] MovieFilterDTO filter)
        {
            var query = _context.Movies.AsQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(filter.SearchTerm))
            {
                query = query.Where(m => m.Title != null && m.Title.Contains(filter.SearchTerm));
            }

            // Apply genre filter
            if (filter.Genres != null && filter.Genres.Count > 0)
            {
                foreach (var genre in filter.Genres)
                {
                    // Use reflection to get the property for the genre
                    var property = typeof(Movie).GetProperty(genre.Replace(" ", ""), BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
                    if (property != null)
                    {
                        query = query.Where(m => EF.Property<int?>(m, property.Name) == 1);
                    }
                }
            }

            // Get total count
            var totalCount = await query.CountAsync();

            // Apply pagination
            var pageSize = filter.PageSize;
            var page = filter.Page;
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var movies = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Get average ratings
            var movieIds = movies.Select(m => m.Id).ToList();
            var ratings = await _context.Ratings
                .Where(r => movieIds.Contains(r.MovieId))
                .GroupBy(r => r.MovieId)
                .Select(g => new { MovieId = g.Key, AverageRating = g.Average(r => r.Value) })
                .ToListAsync();

            var movieDTOs = movies.Select(m => new MovieDTO
            {
                Id = m.Id,
                Title = m.Title,
                Director = m.Director,
                Cast = m.Cast,
                Country = m.Country,
                ReleaseYear = m.ReleaseYear,
                Rating = m.Rating,
                Duration = m.Duration,
                Description = m.Description,
                Type = m.Type,
                Genres = GetGenres(m),
                AverageRating = ratings.FirstOrDefault(r => r.MovieId == m.Id)?.AverageRating
            }).ToList();

            return Ok(new MovieListResponseDTO
            {
                Movies = movieDTOs,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages
            });
        }

        // GET: api/Movies/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MovieDTO>> GetMovie(string id)
        {
            var movie = await _context.Movies.FindAsync(id);

            if (movie == null)
            {
                return NotFound();
            }

            // Get average rating
            var averageRating = await _context.Ratings
                .Where(r => r.MovieId == id)
                .AverageAsync(r => (double?)r.Value);

            var movieDTO = new MovieDTO
            {
                Id = movie.Id,
                Title = movie.Title,
                Director = movie.Director,
                Cast = movie.Cast,
                Country = movie.Country,
                ReleaseYear = movie.ReleaseYear,
                Rating = movie.Rating,
                Duration = movie.Duration,
                Description = movie.Description,
                Type = movie.Type,
                Genres = GetGenres(movie),
                AverageRating = averageRating
            };

            return movieDTO;
        }

        // POST: api/Movies
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<MovieDTO>> CreateMovie(MovieCreateDTO movieDTO)
        {
            var movie = new Movie
            {
                Id = Guid.NewGuid().ToString(),
                Title = movieDTO.Title,
                Director = movieDTO.Director,
                Cast = movieDTO.Cast,
                Country = movieDTO.Country,
                ReleaseYear = movieDTO.ReleaseYear,
                Rating = movieDTO.Rating,
                Duration = movieDTO.Duration,
                Description = movieDTO.Description,
                Type = movieDTO.Type
            };

            // Set genre flags
            foreach (var genre in movieDTO.Genres)
            {
                var property = typeof(Movie).GetProperty(genre.Replace(" ", ""), BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
                if (property != null && property.PropertyType == typeof(int?))
                {
                    property.SetValue(movie, 1);
                }
            }

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMovie), new { id = movie.Id }, new MovieDTO
            {
                Id = movie.Id,
                Title = movie.Title,
                Director = movie.Director,
                Cast = movie.Cast,
                Country = movie.Country,
                ReleaseYear = movie.ReleaseYear,
                Rating = movie.Rating,
                Duration = movie.Duration,
                Description = movie.Description,
                Type = movie.Type,
                Genres = GetGenres(movie)
            });
        }

        // PUT: api/Movies/5
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> UpdateMovie(string id, MovieUpdateDTO movieDTO)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
            {
                return NotFound();
            }

            // Update properties if provided
            if (movieDTO.Title != null) movie.Title = movieDTO.Title;
            if (movieDTO.Director != null) movie.Director = movieDTO.Director;
            if (movieDTO.Cast != null) movie.Cast = movieDTO.Cast;
            if (movieDTO.Country != null) movie.Country = movieDTO.Country;
            if (movieDTO.ReleaseYear != null) movie.ReleaseYear = movieDTO.ReleaseYear;
            if (movieDTO.Rating != null) movie.Rating = movieDTO.Rating;
            if (movieDTO.Duration != null) movie.Duration = movieDTO.Duration;
            if (movieDTO.Description != null) movie.Description = movieDTO.Description;
            if (movieDTO.Type != null) movie.Type = movieDTO.Type;

            // Update genre flags if provided
            if (movieDTO.Genres != null)
            {
                // Reset all genre flags
                foreach (var prop in typeof(Movie).GetProperties())
                {
                    if (prop.PropertyType == typeof(int?) && 
                        prop.Name != "ReleaseYear" && 
                        !new[] { "Id", "Title", "Director", "Cast", "Country", "ReleaseYear", "Rating", "Duration", "Description", "Type" }.Contains(prop.Name))
                    {
                        prop.SetValue(movie, 0);
                    }
                }

                // Set new genre flags
                foreach (var genre in movieDTO.Genres)
                {
                    var property = typeof(Movie).GetProperty(genre.Replace(" ", ""), BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
                    if (property != null && property.PropertyType == typeof(int?))
                    {
                        property.SetValue(movie, 1);
                    }
                }
            }

            _context.Entry(movie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovieExists(id))
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

        // DELETE: api/Movies/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> DeleteMovie(string id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
            {
                return NotFound();
            }

            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Movies/Genres
        [HttpGet("genres")]
        public ActionResult<IEnumerable<string>> GetGenres()
        {
            var genreProperties = typeof(Movie).GetProperties()
                .Where(p => p.PropertyType == typeof(int?) && 
                       !new[] { "ReleaseYear" }.Contains(p.Name))
                .Select(p => p.Name)
                .ToList();

            return Ok(genreProperties);
        }

        private bool MovieExists(string id)
        {
            return _context.Movies.Any(e => e.Id == id);
        }

        private List<string> GetGenres(Movie movie)
        {
            var genres = new List<string>();
            var properties = typeof(Movie).GetProperties();

            foreach (var prop in properties)
            {
                if (prop.PropertyType == typeof(int?) && 
                    prop.Name != "ReleaseYear" && 
                    !new[] { "Id", "Title", "Director", "Cast", "Country", "ReleaseYear", "Rating", "Duration", "Description", "Type" }.Contains(prop.Name))
                {
                    var value = (int?)prop.GetValue(movie);
                    if (value == 1)
                    {
                        genres.Add(prop.Name);
                    }
                }
            }

            return genres;
        }
    }
}
