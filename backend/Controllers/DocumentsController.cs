using Microsoft.AspNetCore.Mvc;
using AI.DocumentAssistant.API.Data;
using AI.DocumentAssistant.API.Models;
using AI.DocumentAssistant.API.Helpers;

namespace AI.DocumentAssistant.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DocumentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file, Guid userId)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

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

            var documentChunks = chunks.Select((chunk, index) => new DocumentChunk
            {
                Id = Guid.NewGuid(),
                DocumentId = document.Id,
                Content = chunk,
                ChunkIndex = index
            }).ToList();

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