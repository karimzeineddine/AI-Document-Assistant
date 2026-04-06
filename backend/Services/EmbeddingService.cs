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
                input = new[]
                {
                    new
                    {
                        content = new[]
                        {
                            new { type = "text", text = text }
                        }
                    }
                },
                encoding_format = "float"
            };

            var request = new HttpRequestMessage(
                HttpMethod.Post,
                "https://openrouter.ai/api/v1/embeddings"
            );

            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey);

            request.Content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.SendAsync(request);
            var json = await response.Content.ReadAsStringAsync();

            Console.WriteLine(json); // debug

            using var doc = JsonDocument.Parse(json);

            if (doc.RootElement.TryGetProperty("error", out var error))
            {
                throw new Exception(error.ToString());
            }

            var embedding = doc
                .RootElement
                .GetProperty("data")[0]
                .GetProperty("embedding");

            // ✅ Deserialize JSON array to List<float>
            return JsonSerializer.Deserialize<List<float>>(embedding.GetRawText())!;
        }
    }
}