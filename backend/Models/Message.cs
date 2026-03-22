namespace AI.DocumentAssistant.API.Models
{
    public class Message
    {
        public Guid Id { get; set; }
        public Guid ChatId { get; set; }

        public string Role { get; set; } // User or AI
        public string Content { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Chat Chat { get; set; }
    }
}