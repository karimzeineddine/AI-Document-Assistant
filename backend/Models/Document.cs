namespace AI.DocumentAssistant.API.Models
{
    public class Document
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public string FileName { get; set; }
        public string FilePath { get; set; }

        public string Status { get; set; } // Processing, Ready, Failed

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; }
    }
}