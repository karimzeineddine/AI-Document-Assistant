namespace AI.DocumentAssistant.API.Models
{
    public class DocumentChunk
    {
        public Guid Id { get; set; }

        public Guid DocumentId { get; set; }

        public string Content { get; set; } = null!;

        public int ChunkIndex { get; set; }

        public Document Document { get; set; } = null!;
    }
}