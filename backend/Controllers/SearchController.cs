using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AI.DocumentAssistant.API.Data;
using AI.DocumentAssistant.API.DTOs;
using AI.DocumentAssistant.API.Helpers;
using AI.DocumentAssistant.API.Services;

namespace AI.DocumentAssistant.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmbeddingService _embeddingService;

        public SearchController(AppDbContext context, EmbeddingService embeddingService)
        {
            _context = context;
            _embeddingService = embeddingService;
        }

        [HttpPost("ask")]
        public async Task<IActionResult> Ask([FromBody] AskRequest request)
        {
            if (string.IsNullOrEmpty(request.Question))
                return BadRequest("Question is required");

            var chunks = await _context.DocumentChunks
                .Where(c => c.Document.UserId == request.UserId)
                .ToListAsync();

            var queryEmbedding = await _embeddingService.GetEmbedding(request.Question);

            var rankedChunks = chunks
                .Select(c => new
                {
                    Content = c.Content,
                    Score = EmbeddingHelper.CosineSimilarity(queryEmbedding, c.Embedding)
                })
                .OrderByDescending(x => x.Score)
                .Take(3)
                .Select(x => x.Content);

            if (!rankedChunks.Any())
            {
                return Ok(new
                {
                    answer = "No relevant information found."
                });
            }

            return Ok(new
            {
                answer = string.Join("\n\n", rankedChunks)
            });
        }
    }
}