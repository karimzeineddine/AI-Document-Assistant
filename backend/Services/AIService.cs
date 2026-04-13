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

    public async Task<string> GenerateAnswer(string question, List<string> chunks)
    {
        var context = string.Join("\n\n", chunks);

        var prompt = $@"
        You are a helpful AI assistant.

        Answer the question clearly and concisely using ONLY the context provided.
        If the answer is not in the context, say: ""I don't know based on the provided information.""

        Context:
        {context}

        Question:
        {question}

        Helpful Answer:
        ";

        var requestBody = new
        {
            model = "openai/gpt-3.5-turbo", // free/cheap model
            messages = new[]
            {
                new { role = "user", content = prompt }
            }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/chat/completions");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        request.Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

        var response = await _httpClient.SendAsync(request);
        var json = await response.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(json);
        var answer = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        return answer;
    }
}