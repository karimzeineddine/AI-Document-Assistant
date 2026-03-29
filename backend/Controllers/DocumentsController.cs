using Microsoft.AspNetCore.Mvc;
using AI.DocumentAssistant.API.Data;
using AI.DocumentAssistant.API.Models;

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
            var filePath = $"Uploads/{fileName}";

            // Save file to disk
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }


            var document = new Document
            {
                Id = Guid.NewGuid(),
                FileName = file.FileName,
                FilePath = filePath,
                UserId = userId,
                Status = "Processing", // 🔥 important for next steps
            };

            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "File uploaded successfully",
                documentId = document.Id
            });
        }
    }
}