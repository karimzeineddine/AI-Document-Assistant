namespace AI.DocumentAssistant.API.Models
{
    public class DocumentChunk
    {
        public Guid Id { get; set; }
        public Guid DocumentId { get; set; }

        public string Content { get; set; }
        public string EmbeddingId { get; set; }

        public Document Document { get; set; }
    }
}