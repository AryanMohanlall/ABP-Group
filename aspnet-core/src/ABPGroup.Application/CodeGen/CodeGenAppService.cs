using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.IO;
using ABPGroup.Projects;
using ABPGroup.Projects.Dto;
using Abp.Application.Services;

namespace ABPGroup.CodeGen
{
    public class CodeGenAppService : ApplicationService, ICodeGenAppService
    {
        private readonly HttpClient _httpClient;
        private const string Endpoint = "https://nwu-vaal-gkss.netlify.app/api/ai";
        private const string Model = "llama-3.1-8b-instant";
        private const string OutputPath = "C:/GeneratedApps";

        public CodeGenAppService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<CodeGenResult> GenerateProjectAsync(CreateUpdateProjectDto request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            var systemMessage = GenerateSystemMessage(request);
            var userMessage = GenerateUserMessage(request);
            var combinedMessage = $"{systemMessage}\n\n{userMessage}";

            var result = await CallAIAsync(combinedMessage);

            if (result == null || result.Files == null || result.Files.Count == 0)
            {
                Logger.Warn("First AI attempt returned invalid or empty result — retrying.");

                var retryMessage = $"{systemMessage}\nYour previous response was invalid JSON. Return ONLY the JSON object with no text before or after it.\n\n{userMessage}";
                result = await CallAIAsync(retryMessage);

                if (result == null || result.Files == null || result.Files.Count == 0)
                    throw new Exception("AI response was invalid JSON after retry. Check RAW AI RESPONSE in logs.");
            }

            var projectName = string.IsNullOrWhiteSpace(request.Name) ? "UnnamedProject" : request.Name;

            foreach (var file in result.Files)
            {
                var normalizedPath = file.Path.Replace("/", Path.DirectorySeparatorChar.ToString())
                                              .Replace("\\", Path.DirectorySeparatorChar.ToString());
                var fullPath = Path.Combine(OutputPath, projectName, normalizedPath);
                var dir = Path.GetDirectoryName(fullPath);

                if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
                    Directory.CreateDirectory(dir);

                File.WriteAllText(fullPath, file.Content, Encoding.UTF8);
                Logger.Debug($"Written: {fullPath}");
            }

            result.OutputPath = Path.Combine(OutputPath, projectName);
            result.GeneratedProjectId = request.Id;

            Logger.Info($"Generation complete. {result.Files.Count} files written to {result.OutputPath}");

            return result;
        }

        private async Task<CodeGenResult> CallAIAsync(string message)
        {
            var payload = new
            {
                model = Model,
                message = message
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(Endpoint, content);
            var responseString = await response.Content.ReadAsStringAsync();

            Logger.Warn($"RAW AI RESPONSE [{(int)response.StatusCode}]: {responseString}");

            if (!response.IsSuccessStatusCode)
            {
                Logger.Error($"AI endpoint returned {(int)response.StatusCode}: {responseString}");
                return null;
            }

            return ParseAIResponse(responseString);
        }

        private CodeGenResult ParseAIResponse(string responseString)
        {
            var opts = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            // Attempt 1 — response is already a raw CodeGenResult
            try
            {
                var direct = JsonSerializer.Deserialize<CodeGenResult>(responseString, opts);
                if (direct?.Files != null && direct.Files.Count > 0)
                {
                    Logger.Info("Parsed AI response directly.");
                    return direct;
                }
            }
            catch { }

            // Attempt 2 — response is wrapped in an envelope property
            try
            {
                using var doc = JsonDocument.Parse(responseString);
                var root = doc.RootElement;

                string inner = null;

                if (root.TryGetProperty("response", out var r)) inner = r.GetString();
                else if (root.TryGetProperty("content", out var c)) inner = c.GetString();
                else if (root.TryGetProperty("result", out var res)) inner = res.GetString();
                else if (root.TryGetProperty("message", out var m)) inner = m.GetString();
                else if (root.TryGetProperty("text", out var t)) inner = t.GetString();
                else if (root.TryGetProperty("output", out var o)) inner = o.GetString();

                if (!string.IsNullOrWhiteSpace(inner))
                {
                    inner = StripMarkdownFences(inner);
                    Logger.Info($"Unwrapped AI envelope. Inner length: {inner.Length}");

                    var unwrapped = JsonSerializer.Deserialize<CodeGenResult>(inner, opts);
                    if (unwrapped?.Files != null && unwrapped.Files.Count > 0)
                        return unwrapped;
                }
            }
            catch (Exception ex)
            {
                Logger.Error($"Failed to unwrap AI envelope: {ex.Message}");
            }

            // Attempt 3 — the entire response string is the inner JSON (no envelope)
            // but with markdown fences around it
            try
            {
                var stripped = StripMarkdownFences(responseString);
                var fallback = JsonSerializer.Deserialize<CodeGenResult>(stripped, opts);
                if (fallback?.Files != null && fallback.Files.Count > 0)
                {
                    Logger.Info("Parsed AI response after stripping markdown fences.");
                    return fallback;
                }
            }
            catch { }

            Logger.Error("All parse attempts failed. Check RAW AI RESPONSE log above.");
            return null;
        }

        private static string StripMarkdownFences(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return text;

            text = text.Trim();

            if (text.StartsWith("```json", StringComparison.OrdinalIgnoreCase))
                text = text.Substring(7);
            else if (text.StartsWith("```"))
                text = text.Substring(3);

            if (text.EndsWith("```"))
                text = text.Substring(0, text.Length - 3);

            return text.Trim();
        }

        private string GenerateSystemMessage(CreateUpdateProjectDto input)
        {
            var framework = FormatFramework(input.Framework);
            var language = FormatLanguage(input.Language);
            var database = FormatDatabase(input.DatabaseOption);
            var auth = input.IncludeAuth ? "next-auth v5 with credentials + JWT" : "none";

            return $@"You are a senior full-stack developer. Generate a COMPLETE, PRODUCTION-READY {framework} full-stack application based on the user's description. Every file must be fully implemented and ready to run with zero modifications.

App configuration:
- Framework:  {framework}
- Language:   {language}
- Database:   {database}
- Auth:       {auth}

Next.js 16 rules — follow exactly:
- Use proxy.ts instead of middleware.ts (Next.js 16 renamed it)
- Export a function named 'proxy' not 'middleware'
- Use 'use cache' directive for cached data fetching
- Turbopack is default — do NOT add webpack config in next.config.ts
- Use React 19 patterns — useActionState instead of useFormState
- next.config.ts (TypeScript) not next.config.js

You MUST generate ALL of these files — no skipping, no omitting:
- package.json (all deps + scripts: dev, build, start, lint)
- tsconfig.json (strict: true)
- next.config.ts
- .env.example (every env var used anywhere in the code)
- README.md (setup, env vars, how to run, how to deploy)
- prisma/schema.prisma (if PostgreSQL)
- src/app/layout.tsx
- src/app/page.tsx
- src/app/globals.css
- src/app/loading.tsx
- src/app/error.tsx
- src/app/not-found.tsx
- src/app/api/[every route needed]/route.ts
- src/app/api/auth/[...nextauth]/route.ts (if auth)
- src/app/auth/login/page.tsx (if auth)
- src/app/auth/register/page.tsx (if auth)
- src/proxy.ts (NOT middleware.ts — if auth)
- src/components/ui/Button.tsx
- src/components/ui/Input.tsx
- src/components/ui/Card.tsx
- src/components/layout/Header.tsx
- src/components/layout/Footer.tsx
- src/lib/db.ts
- src/lib/auth.ts (if auth)
- src/lib/utils.ts
- src/lib/validations.ts
- src/types/index.ts

INVARIANTS — violating any means the output is wrong:
1. Zero placeholders — no TODO, no 'add your logic here', no empty bodies
2. Every import resolves to a file you generated or an npm package in package.json
3. Every API route has complete request handling, validation, db query, and response
4. All database operations use real Prisma queries or Mongoose methods
5. package.json lists every npm package imported anywhere
6. .env.example lists every process.env variable used anywhere
7. The app must be built around the user's prompt — not a generic template

Return ONLY this JSON — no markdown, no explanation, no code fences, no text before or after:
{{
  ""files"": [
    {{ ""path"": ""path/from/project/root"", ""content"": ""complete file content"" }}
  ],
  ""architectureSummary"": ""2-3 sentences describing what was built"",
  ""moduleList"": [""every"", ""top-level"", ""feature"", ""or"", ""module""]
}}";
        }

        private string GenerateUserMessage(CreateUpdateProjectDto input)
        {
            var prompt = input.Prompt ?? string.Empty;
            var name = string.IsNullOrWhiteSpace(input.Name) ? "Unnamed Project" : input.Name;
            return $"Build this app: {prompt}\nProject name: {name}";
        }

        private static string FormatFramework(Framework framework)
        {
            return framework switch
            {
                Framework.ReactVite => "React (Vite)",
                Framework.Angular => "Angular",
                Framework.Vue => "Vue",
                Framework.DotNetBlazor => ".NET Blazor",
                _ => "Next.js 16.1 (App Router, Turbopack enabled by default)"
            };
        }

        private static string FormatLanguage(ProgrammingLanguage language)
        {
            return language switch
            {
                ProgrammingLanguage.JavaScript => "JavaScript",
                ProgrammingLanguage.CSharp => "C#",
                _ => "TypeScript (strict mode)"
            };
        }

        private static string FormatDatabase(DatabaseOption option)
        {
            return option switch
            {
                DatabaseOption.MongoCloud => "MongoDB via Mongoose",
                _ => "PostgreSQL via Prisma"
            };
        }
    }
}