namespace AI.DocumentAssistant.API.Models
{
    public class Chat
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; }
    }
}