using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AI.DocumentAssistant.API.Data;
using AI.DocumentAssistant.API.DTOs;

namespace AI.DocumentAssistant.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SearchController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("ask")]
        public async Task<IActionResult> Ask([FromBody] AskRequest request)
        {
            if (string.IsNullOrEmpty(request.Question))
                return BadRequest("Question is required");

            var chunks = await _context.DocumentChunks
                .Include(c => c.Document)
                .Where(c => c.Document.UserId == request.UserId)
                .ToListAsync();

            var keywords = request.Question
                .ToLower()
                .Split(' ', StringSplitOptions.RemoveEmptyEntries);

            var results = chunks
                .Select(c => new
                {
                    Chunk = c,
                    Score = keywords.Count(k => c.Content.ToLower().Contains(k))
                })
                .Where(x => x.Score > 0)
                .OrderByDescending(x => x.Score)
                .Take(5)
                .Select(x => x.Chunk)
                .ToList();

            if (!results.Any())
            {
                return Ok(new
                {
                    answer = "No relevant information found."
                });
            }

            return Ok(new
            {
                answer = string.Join("\n\n", results.Select(r => r.Content))
            });
        }
    }
}