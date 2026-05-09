using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AI.DocumentAssistant.API.Data;
using AI.DocumentAssistant.API.DTOs;
using AI.DocumentAssistant.API.Models;
using AI.DocumentAssistant.API.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace AI.DocumentAssistant.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmbeddingService _embeddingService;
        private readonly AIService _aiService;

        public SearchController(AppDbContext context, EmbeddingService embeddingService, AIService aiService)
        {
            _context = context;
            _embeddingService = embeddingService;
            _aiService = aiService;
        }
        [Authorize]
        [HttpPost("ask")]
        public async Task<IActionResult> Ask([FromBody] AskRequest request)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdString == null)
                return Unauthorized();

            var userId = Guid.Parse(userIdString);

            if (string.IsNullOrEmpty(request.Question))
                return BadRequest("Question is required");

            // 🔥 STEP 1: Get or create chat
            Chat chat;

            if (request.ChatId.HasValue)
            {
                chat = await _context.Chats
                    .FirstOrDefaultAsync(c => c.Id == request.ChatId.Value);
            }
            else
            {
                chat = null;
            }

            if (chat == null)
            {
                chat = new Chat
                {
                    Id = Guid.NewGuid(),
                    UserId = userId
                };

                _context.Chats.Add(chat);
                await _context.SaveChangesAsync();
            }

            // 🔥 STEP 2: Save user message
            _context.Messages.Add(new Message
            {
                ChatId = chat.Id,
                Role = Message.MessageRole.User,
                Content = request.Question
            });

            await _context.SaveChangesAsync();

            // 🔥 STEP 3: Get chat history
            var history = await _context.Messages
                .Where(m => m.ChatId == chat.Id)
                .OrderByDescending(m => m.CreatedAt)
                .Take(10)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();

            // 🔥 STEP 4: Convert to AI format
            var messages = history.Select(m => new ChatMessageDto
            {
                Role = m.Role == Message.MessageRole.User ? "user" : "assistant",
                Content = m.Content
            }).ToList();

            // 🔥 STEP 5: RAG search - get all chunks for this user's documents
            var chunks = await _context.DocumentChunks
                .Where(c => c.Document.UserId == userId)
                .OrderBy(c => c.DocumentId)
                .ThenBy(c => c.ChunkIndex)
                .ToListAsync();

            Console.WriteLine($"Total chunks found: {chunks.Count}"); // ← debug log

            // Take the most relevant chunks (increase limit if needed)
            var contextText = string.Join("\n\n", chunks
                .Take(10)                        // ← removed the keyword filter
                .Select(c => c.Content));

            // Inject context
            messages.Insert(0, new ChatMessageDto
            {
                Role = "system",
                Content = string.IsNullOrEmpty(contextText)
                    ? "You are a helpful document assistant. No documents have been uploaded yet."
                    : $"You are a helpful document assistant. Answer questions based on the following document content:\n\n{contextText}\n\nIf the answer is not in the documents, say so clearly."
            });

            // 🔥 STEP 6: Call AI (you already have this)
            var aiAnswer = await _aiService.GenerateAnswer(messages);

            // 🔥 STEP 7: Save AI response
            _context.Messages.Add(new Message
            {
                ChatId = chat.Id,
                Role = Message.MessageRole.Assistant,
                Content = aiAnswer
            });

            await _context.SaveChangesAsync();

            // 🔥 STEP 8: Return result
            return Ok(new
            {
                chatId = chat.Id,
                answer = aiAnswer
            });
        }
    }
}