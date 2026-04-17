namespace AI.DocumentAssistant.API.Models
{
    public class Message
    {
        public Guid Id { get; set; }
        public Guid ChatId { get; set; }

        public enum MessageRole
        {
            User,
            Assistant
        }
        public MessageRole Role { get; set; }
        public string Content { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Chat Chat { get; set; }
    }
}