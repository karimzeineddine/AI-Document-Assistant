using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AI.DocumentAssistant.API.Data;
using AI.DocumentAssistant.API.DTOs;
using AI.DocumentAssistant.API.Models;
using AI.DocumentAssistant.API.Services;

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

        [HttpPost("ask")]
        public async Task<IActionResult> Ask([FromBody] AskRequest request)
        {
            if (string.IsNullOrEmpty(request.Question))
                return BadRequest("Question is required");

            // 🔥 STEP 1: Get or create chat
            var chat = await _context.Chats
                .FirstOrDefaultAsync(c => c.Id == request.ChatId);

            if (chat == null)
            {
                chat = new Chat
                {
                    Id = Guid.NewGuid(),
                    UserId = request.UserId
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

            // 🔥 STEP 5: RAG search (your existing logic)
            var chunks = await _context.DocumentChunks
                .Where(c => c.Document.UserId == request.UserId)
                .ToListAsync();

            var context = string.Join("\n\n", chunks
                .Where(c => c.Content.ToLower().Contains(request.Question.ToLower()))
                .Take(3)
                .Select(c => c.Content));

            // Inject context
            messages.Insert(0, new ChatMessageDto
            {
                Role = "system",
                Content = $"Use this context to answer:\n{context}"
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