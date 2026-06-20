using Microsoft.AspNetCore.Mvc;
using AI.DocumentAssistant.API.Data;
using Microsoft.AspNetCore.Authorization;
using AI.DocumentAssistant.API.Models;
using AI.DocumentAssistant.API.Helpers;
using AI.DocumentAssistant.API.Services;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace AI.DocumentAssistant.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public DashboardController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null)
                return Unauthorized();

            var userId = Guid.Parse(userIdString);

            var oneWeekAgo = DateTime.UtcNow.AddDays(-7);
            var oneMonthAgo = DateTime.UtcNow.AddMonths(-1);

            // Documents
            var totalDocuments = await _context.Documents
                .CountAsync(d => d.UserId == userId);

            var documentsThisWeek = await _context.Documents
                .CountAsync(d => d.UserId == userId && d.CreatedAt >= oneWeekAgo);

            // Chats
            var totalChatSessions = await _context.Chats
                .CountAsync(c => c.UserId == userId);

            var chatsThisWeek = await _context.Chats
                .CountAsync(c => c.UserId == userId && c.CreatedAt >= oneWeekAgo);

            // Storage
            var storageUsedBytes = await _context.Documents
                .Where(d => d.UserId == userId)
                .SumAsync(d => (long?)d.FileSizeBytes) ?? 0;

            // AI queries (user messages = one query each)
            var totalAiQueries = await _context.Messages
                .CountAsync(m => m.Chat.UserId == userId
                               && m.Role == Message.MessageRole.User);

            var aiQueriesThisMonth = await _context.Messages
                .CountAsync(m => m.Chat.UserId == userId
                               && m.Role == Message.MessageRole.User
                               && m.CreatedAt >= oneMonthAgo);

            return Ok(new
            {
                totalDocuments,
                documentsThisWeek,
                totalChatSessions,
                chatsThisWeek,
                storageUsedBytes,
                storageUsedMb = Math.Round(storageUsedBytes / 1024.0 / 1024.0, 2),
                totalAiQueries,
                aiQueriesThisMonth
            });
        }
    }
}