using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.UI;
using Microsoft.Extensions.Configuration;
using Castle.Core.Logging;

namespace ABPGroup.CodeGen;

public class ClaudeApiClient : IClaudeApiClient
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    public ILogger Logger { get; set; }

    public ClaudeApiClient(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        Logger = NullLogger.Instance;
    }

    public async Task<string> CallClaudeAsync(string systemPrompt, string userPrompt)
    {
        var apiKey = _configuration["Claude:ApiKey"];
        var model = _configuration["Claude:Model"] ?? "claude-opus-4-6";
        var baseUrl = "https://api.anthropic.com/v1/messages";

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new UserFriendlyException("Claude API key is not configured.");
        }

        int maxRetries = 3;
        int delaySeconds = 2;

        for (int i = 0; i <= maxRetries; i++)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromSeconds(600);
                client.DefaultRequestHeaders.Add("x-api-key", apiKey);
                client.DefaultRequestHeaders.Add("anthropic-version", "2023-06-01");

                var requestBody = new
                {
                    model = model,
                    max_tokens = 8192,
                    system = systemPrompt,
                    messages = new[]
                    {
                        new { role = "user", content = userPrompt }
                    }
                };

                var json = JsonSerializer.Serialize(requestBody);
                var request = new HttpRequestMessage(HttpMethod.Post, baseUrl)
                {
                    Content = new StringContent(json, Encoding.UTF8, "application/json")
                };

                var response = await client.SendAsync(request);

                if (response.StatusCode == (System.Net.HttpStatusCode)429)
                {
                    if (i == maxRetries) throw new UserFriendlyException("Claude API is currently overloaded. Please try again in a few minutes.");

                    Logger.Warn($"Claude API Rate Limit (429). Retrying in {delaySeconds}s... (Attempt {i + 1}/{maxRetries})");
                    await Task.Delay(TimeSpan.FromSeconds(delaySeconds));
                    delaySeconds *= 2;
                    continue;
                }

                response.EnsureSuccessStatusCode();

                var responseJson = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(responseJson);
                
                // Claude response structure: {"content": [{"type": "text", "text": "..."}]}
                return doc.RootElement
                    .GetProperty("content")[0]
                    .GetProperty("text")
                    .GetString() ?? string.Empty;
            }
            catch (HttpRequestException ex) when (i < maxRetries)
            {
                Logger.Warn($"Claude API HTTP Request failed: {ex.Message}. Retrying in {delaySeconds}s...");
                await Task.Delay(TimeSpan.FromSeconds(delaySeconds));
                delaySeconds *= 2;
            }
            catch (Exception ex)
            {
                Logger.Error($"Claude API unexpected error: {ex.Message}", ex);
                if (i == maxRetries) throw new UserFriendlyException($"Failed to call Claude API: {ex.Message}");
                await Task.Delay(TimeSpan.FromSeconds(delaySeconds));
                delaySeconds *= 2;
            }
        }

        throw new UserFriendlyException("Failed to call Claude API after multiple retries.");
    }
}
