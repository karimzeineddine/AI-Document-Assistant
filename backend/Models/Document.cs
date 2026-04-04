namespace AI.DocumentAssistant.API.Models
{
    public class Document
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public string FileName { get; set; } = null!;
        public string FilePath { get; set; } = null!;

        public string Status { get; set; } = null!;

        public string? Content { get; set; } // 🔥 NEW

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
    }
}