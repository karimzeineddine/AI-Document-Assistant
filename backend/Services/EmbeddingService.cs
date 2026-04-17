using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace AI.DocumentAssistant.API.Services
{
    public class EmbeddingService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public EmbeddingService(IConfiguration config)
        {
            _httpClient = new HttpClient();
            _apiKey = config["OpenRouter:ApiKey"]
                ?? throw new Exception("OpenRouter API key missing");
        }

        public async Task<List<float>> GetEmbedding(string text)
        {
            var requestBody = new
            {
                model = "nvidia/llama-nemotron-embed-vl-1b-v2:free",
                input = text
            };

            var request = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/embeddings");

            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
            request.Headers.Add("HTTP-Referer", "http://localhost");
            request.Headers.Add("X-Title", "AI Document Assistant");

            request.Content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.SendAsync(request);
            var json = await response.Content.ReadAsStringAsync();

            Console.WriteLine(json); // 🔥 DEBUG
            Console.WriteLine("API KEY: " + _apiKey);
            Console.WriteLine(request.Headers.Authorization);
            using var doc = JsonDocument.Parse(json);

            if (!doc.RootElement.TryGetProperty("data", out var data))
                throw new Exception("Embedding error: " + json);

            var embeddingArray = data[0].GetProperty("embedding");

            return embeddingArray.EnumerateArray()
                .Select(x => x.GetSingle())
                .ToList();
        }
    }
}