using Microsoft.AspNetCore.Mvc;
using AI.DocumentAssistant.API.Data;
using AI.DocumentAssistant.API.Models;
using AI.DocumentAssistant.API.Helpers;
using AI.DocumentAssistant.API.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace AI.DocumentAssistant.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmbeddingService _embeddingService;

        public DocumentsController(AppDbContext context, EmbeddingService embeddingService)
        {
            _context = context;
            _embeddingService = embeddingService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
                return Unauthorized("Invalid token");

            var userId = Guid.Parse(userIdClaim);

            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var allowedExtensions = new[] { ".pdf", ".docx", ".txt" };

            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
                return BadRequest("Invalid file type");
            if (file.Length > 10 * 1024 * 1024) // 10MB
                return BadRequest("File too large");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // 🔥 Extract text
            var extractedText = TextExtractor.ExtractText(filePath);

            // 🔥 Split into chunks
            var chunks = TextChunker.SplitText(extractedText);

            var document = new Document
            {
                Id = Guid.NewGuid(),
                FileName = file.FileName,
                FilePath = $"Uploads/{fileName}",
                UserId = userId,
                Status = "Ready", // 🔥 now ready immediately
                Content = extractedText
            };

            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            var documentChunks = new List<DocumentChunk>();

            for (int i = 0; i < chunks.Count; i++)
            {
                var chunk = chunks[i];

                // 🔥 Generate embedding
                var embedding = await _embeddingService.GetEmbedding(chunk);

                documentChunks.Add(new DocumentChunk
                {
                    Id = Guid.NewGuid(),
                    DocumentId = document.Id,
                    Content = chunk,
                    ChunkIndex = i,
                    Embedding = embedding
                });
            }

            _context.DocumentChunks.AddRange(documentChunks);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "File uploaded & processed",
                documentId = document.Id
            });
        }
    }
}