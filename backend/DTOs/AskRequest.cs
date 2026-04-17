namespace AI.DocumentAssistant.API.DTOs
{
    public class AskRequest
    {
        public Guid UserId { get; set; }
        public Guid? ChatId { get; set; }
        public string Question { get; set; } = null!;
    }
}