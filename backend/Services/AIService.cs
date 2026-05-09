using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

public class AIService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public AIService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _apiKey = config["OpenRouter:ApiKey"]
                ?? throw new Exception("OpenRouter API key missing");
    }

    public async Task<string> GenerateAnswer(List<ChatMessageDto> messages)
    {
        var requestBody = new
        {
            model = "openai/gpt-3.5-turbo",
            messages = messages.Select(m => new
            {
                role = m.Role,
                content = m.Content
            })
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/chat/completions");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        request.Content = new StringContent(
            JsonSerializer.Serialize(requestBody),
            Encoding.UTF8,
            "application/json"
        );

        var response = await _httpClient.SendAsync(request);
        var json = await response.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(json);

        // ⚠️ safer parsing
        if (!doc.RootElement.TryGetProperty("choices", out var choices))
            throw new Exception("Invalid AI response: " + json);

        var answer = choices[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        return answer;
    }
    public async Task<string> GenerateChatTitle(string question, string answer)
    {
        var prompt = $@"Generate a very short title (max 5 words) for this conversation.

        Question: {question}

        Answer: {answer}

        Return ONLY the title, no quotes, no punctuation.";

        var messages = new List<ChatMessageDto>
    {
        new ChatMessageDto { Role = "user", Content = prompt }
    };

        var title = await GenerateAnswer(messages);

        return title?.Trim() ?? "New Chat";
    }
}