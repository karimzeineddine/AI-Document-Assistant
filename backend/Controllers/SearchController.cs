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

            if (string.IsNullOrWhiteSpace(request.Question))
                return BadRequest("Question is required");

            // 🔥 STEP 1: Get or create chat
            Chat? chat = null;

            if (request.ChatId.HasValue)
            {
                chat = await _context.Chats
                    .FirstOrDefaultAsync(c =>
                        c.Id == request.ChatId.Value &&
                        c.UserId == userId);
            }

            if (chat == null)
            {
                chat = new Chat
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Title = "", // will generate later
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Chats.Add(chat);
                await _context.SaveChangesAsync();
            }

            // 🔥 STEP 2: Save user message
            _context.Messages.Add(new Message
            {
                ChatId = chat.Id,
                Role = Message.MessageRole.User,
                Content = request.Question,
                CreatedAt = DateTime.UtcNow
            });

            chat.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // 🔥 STEP 3: Get recent chat history
            var history = await _context.Messages
                .Where(m => m.ChatId == chat.Id)
                .OrderByDescending(m => m.CreatedAt)
                .Take(10)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();

            // 🔥 STEP 4: Convert to AI format
            var messages = history.Select(m => new ChatMessageDto
            {
                Role = m.Role == Message.MessageRole.User
                    ? "user"
                    : "assistant",

                Content = m.Content
            }).ToList();

            // 🔥 STEP 5: Get document chunks (RAG)
            var chunks = await _context.DocumentChunks
                .Where(c => c.Document.UserId == userId)
                .OrderBy(c => c.DocumentId)
                .ThenBy(c => c.ChunkIndex)
                .Take(10)
                .ToListAsync();

            var contextText = string.Join(
                "\n\n",
                chunks.Select(c => c.Content)
            );

            // 🔥 STEP 6: Inject system prompt
            messages.Insert(0, new ChatMessageDto
            {
                Role = "system",
                Content = string.IsNullOrWhiteSpace(contextText)
                    ? "You are a helpful document assistant. No documents have been uploaded yet."
                    : $@"
You are a helpful document assistant.

Answer questions ONLY using the provided document context.

Document Context:
{contextText}

If the answer is not found in the documents,
say clearly that the information does not exist in the uploaded files.
"
            });

            // 🔥 STEP 7: Generate AI response
            var aiAnswer = await _aiService.GenerateAnswer(messages);

            // 🔥 STEP 8: Save AI response
            _context.Messages.Add(new Message
            {
                ChatId = chat.Id,
                Role = Message.MessageRole.Assistant,
                Content = aiAnswer,
                CreatedAt = DateTime.UtcNow
            });

            // 🔥 STEP 9: Generate title ONLY once
            if (string.IsNullOrWhiteSpace(chat.Title))
            {
                var generatedTitle = await _aiService.GenerateChatTitle(
                    request.Question,
                    aiAnswer
                );

                chat.Title = string.IsNullOrWhiteSpace(generatedTitle)
                    ? request.Question[..Math.Min(40, request.Question.Length)]
                    : generatedTitle;
            }

            chat.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // 🔥 STEP 10: Return response
            return Ok(new
            {
                chatId = chat.Id,
                title = chat.Title,
                answer = aiAnswer
            });
        }

        [Authorize]
        [HttpGet("chat")]
        public async Task<IActionResult> GetChats()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdString == null)
                return Unauthorized();

            var userId = Guid.Parse(userIdString);

            var chats = await _context.Chats
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.UpdatedAt)
                .Select(c => new ChatListDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync();

            return Ok(chats);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetChat(Guid id)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdString == null)
                return Unauthorized();

            var userId = Guid.Parse(userIdString);

            var chat = await _context.Chats
                .Include(c => c.Messages)
                .FirstOrDefaultAsync(c =>
                    c.Id == id &&
                    c.UserId == userId);

            if (chat == null)
                return NotFound();

            var result = new ChatDetailsDto
            {
                Id = chat.Id,
                Title = chat.Title,
                Messages = chat.Messages
                    .OrderBy(m => m.CreatedAt)
                    .Select(m => new ChatMessageDto
                    {
                        Id = m.Id,
                        Role = m.Role == Message.MessageRole.User
                            ? "user"
                            : "assistant",
                        Content = m.Content,
                        CreatedAt = m.CreatedAt
                    })
                    .ToList()
            };

            return Ok(result);
        }
    }
}