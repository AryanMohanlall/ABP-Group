using System.Net.Http;
using System.Threading.Tasks;
using ABPGroup.CodeGen;
using Xunit;

namespace ABPGroup.Tests.CodeGen
{
    public class CodeGenServiceTests
    {
        [Fact]
        public async Task GenerateProjectAsync_ReturnsResult_WithValidInput()
        {
            // Arrange
            var httpClient = new HttpClient(new MockHttpMessageHandler());
            var service = new CodeGenService(httpClient);
            var request = new CodeGenRequest
            {
                Id = 1,
                WorkspaceId = 1,
                PromptId = 1,
                Name = "TestApp",
                Prompt = "A simple todo app",
                PromptVersion = 1,
                PromptSubmittedAt = System.DateTime.UtcNow,
                Framework = 1,
                Language = 1,
                DatabaseOption = 1,
                IncludeAuth = true,
                Status = 1,
                CreatedAt = System.DateTime.UtcNow
            };

            // Act
            var result = await service.GenerateProjectAsync(request);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.Files);
            Assert.True(result.Files.Count > 0);
            Assert.False(string.IsNullOrEmpty(result.OutputPath));
        }
    }

    // Mock handler to simulate API response
    public class MockHttpMessageHandler : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
        {
            var json = "{\"files\":[{\"path\":\"README.md\",\"content\":\"# Test App\"}],\"architectureSummary\":\"A test app.\",\"moduleList\":[\"test\"]}";
            var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
            {
                Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json")
            };
            return Task.FromResult(response);
        }
    }
}
