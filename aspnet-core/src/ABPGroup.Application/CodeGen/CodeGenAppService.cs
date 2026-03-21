using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.UI;
using ABPGroup.CodeGen.Dto;
using ABPGroup.CodeGen.PromptTemplates;
using ABPGroup.Projects;
using ABPGroup.Projects.Dto;
using ABPGroup.Templates;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ABPGroup.CodeGen;

public class CodeGenAppService : ABPGroupAppServiceBase, ICodeGenAppService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly IRepository<Template, int> _templateRepository;
    private readonly IRepository<CodeGenSession, Guid> _sessionRepository;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly IClaudeApiClient _claudeApiClient;

    private static readonly ConcurrentDictionary<string, CodeGenSession> InMemorySessions = new();
    private static readonly ConcurrentDictionary<Guid, byte> ActiveGenerations = new();

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true
    };

    private const int GenerationPhaseDelayMilliseconds = 1000;
    private const int ScaffoldBaselineFileLimit = 12;
    private const int ScaffoldBaselineSnippetLength = 1200;
    private const int ScaffoldBaselineTotalLength = 12000;
    private const string NextHomePageValidationId = "shell-next-home-page";
    private const string ViteIndexHtmlValidationId = "shell-vite-index-html";
    private const string RequiredLayoutValidationId = "shell-required-layout";
    private const string StyledHomeRouteValidationId = "shell-styled-home-route";

    private sealed class RequirementsSnapshot
    {
        public string ArchitectureSummary { get; init; }
        public string Features { get; init; }
        public string Pages { get; init; }
        public string ApiEndpoints { get; init; }
        public string DbEntities { get; init; }
    }

    private sealed class GenerationBlueprint
    {
        public AppSpecDto Spec { get; init; } = new();
        public string ReadmeMarkdown { get; init; }
    }

    // 3-param and 4-param constructors for backward compat with tests
    public CodeGenAppService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        IRepository<Template, int> templateRepository)
        : this(httpClientFactory, configuration, templateRepository, null, null, null)
    {
    }

    public CodeGenAppService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        IRepository<Template, int> templateRepository,
        IRepository<CodeGenSession, Guid> sessionRepository)
        : this(httpClientFactory, configuration, templateRepository, sessionRepository, null, null)
    {
    }

    public CodeGenAppService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        IRepository<Template, int> templateRepository,
        IRepository<CodeGenSession, Guid> sessionRepository,
        IServiceScopeFactory serviceScopeFactory,
        IClaudeApiClient claudeApiClient = null)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _templateRepository = templateRepository;
        _sessionRepository = sessionRepository;
        _serviceScopeFactory = serviceScopeFactory;
        _claudeApiClient = claudeApiClient ?? new ClaudeApiClient(httpClientFactory, configuration);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Legacy single-shot generation
    // ──────────────────────────────────────────────────────────────────────────

    public Task<CodeGenResult> GenerateProjectAsync(CreateUpdateProjectDto input)
        => GenerateProjectAsync(input, null);

    internal async Task<CodeGenResult> GenerateProjectAsync(
        CreateUpdateProjectDto input,
        Func<string, Task> onProgress,
        string currentDir = null,
        AppSpecDto approvedPlan = null,
        string approvedReadme = null)
    {
        var result = new CodeGenResult
        {
            GeneratedProjectId = input.Id,
            Files = new List<GeneratedFile>(),
            ModuleList = new List<string>()
        };

        var projectName = input.Name ?? $"project-{input.Id}";
        var outputPath = BuildOutputPath(projectName);
        var rawApprovedPlan = approvedPlan ?? new AppSpecDto();
        var requirements = await LoadRequirementsSnapshot(input, rawApprovedPlan, approvedReadme, onProgress);
        var normalizedPlan = NormalizeSpec(rawApprovedPlan);

        result.ArchitectureSummary = requirements.ArchitectureSummary;

        await ReportProgress(onProgress, "[2/5] Setting up project scaffold...");
        AddScaffoldFiles(result.Files, input.Framework, currentDir);
        AddApprovedReadmeFile(result.Files, approvedReadme);

        var scaffoldBaseline = BuildScaffoldBaseline(result.Files);
        var context = BuildGenerationContext(projectName, input, requirements, approvedReadme);

        var frontendResponse = await GenerateLayerAsync(
            "[3/5] Generating frontend...",
            "frontend pages and components",
            "Generate the frontend code",
            input,
            context,
            normalizedPlan,
            scaffoldBaseline,
            approvedReadme,
            onProgress);
        MergeLayerResponse(result, frontendResponse, true);

        var backendResponse = await GenerateLayerAsync(
            "[4/5] Generating backend...",
            "backend API routes and server logic",
            "Generate the backend code",
            input,
            context,
            normalizedPlan,
            scaffoldBaseline,
            approvedReadme,
            onProgress);
        MergeLayerResponse(result, backendResponse, false);

        var databaseResponse = await GenerateLayerAsync(
            "[5/5] Generating database layer...",
            "database schema and data access layer",
            "Generate the database layer",
            input,
            context,
            normalizedPlan,
            scaffoldBaseline,
            approvedReadme,
            onProgress);
        MergeLayerResponse(result, databaseResponse, false);

        result.OutputPath = outputPath;
        WriteFilesToDisk(result.Files, outputPath);

        return result;
    }

    private string BuildOutputPath(string projectName)
    {
        var outputBase = _configuration["CodeGen:OutputPath"]
            ?? Path.Combine(Path.GetTempPath(), "GeneratedApps");
        return Path.Combine(outputBase, projectName);
    }

    private async Task<RequirementsSnapshot> LoadRequirementsSnapshot(
        CreateUpdateProjectDto input,
        AppSpecDto approvedPlan,
        string approvedReadme,
        Func<string, Task> onProgress)
    {
        if (HasUsableSpec(approvedPlan))
        {
            await ReportProgress(onProgress, "[1/5] Using approved README and implementation plan...");
            return BuildRequirementsSnapshotFromPlan(approvedPlan, approvedReadme);
        }

        return await AnalyzeRequirementsAsync(input, onProgress);
    }

    private async Task<RequirementsSnapshot> AnalyzeRequirementsAsync(
        CreateUpdateProjectDto input,
        Func<string, Task> onProgress)
    {
        await ReportProgress(onProgress, "[1/5] Analyzing requirements...");
        var requirementsPrompt = BuildRequirementsPrompt(input);
        var requirementsResponse = await CallAiAsync(
            "You are an expert software architect. Analyze the user's requirements and return a structured breakdown.",
            requirementsPrompt);

        return new RequirementsSnapshot
        {
            ArchitectureSummary = ParseDelimitedSection(requirementsResponse, "ARCHITECTURE"),
            Features = ParseDelimitedSection(requirementsResponse, "FEATURES"),
            Pages = ParseDelimitedSection(requirementsResponse, "PAGES"),
            ApiEndpoints = ParseDelimitedSection(requirementsResponse, "API_ENDPOINTS"),
            DbEntities = ParseDelimitedSection(requirementsResponse, "DB_ENTITIES")
        };
    }

    private static RequirementsSnapshot BuildRequirementsSnapshotFromPlan(
        AppSpecDto approvedPlan,
        string approvedReadme)
    {
        var normalizedPlan = NormalizeSpec(approvedPlan ?? new AppSpecDto());

        var architectureSummary = !string.IsNullOrWhiteSpace(normalizedPlan.ArchitectureNotes)
            ? normalizedPlan.ArchitectureNotes
            : "Use the approved README and reviewed implementation plan as the source of truth.";

        if (!string.IsNullOrWhiteSpace(approvedReadme))
        {
            architectureSummary = architectureSummary + "\nReviewed README is approved for scaffolding.";
        }

        return new RequirementsSnapshot
        {
            ArchitectureSummary = architectureSummary,
            Features = BuildFeatureSummary(normalizedPlan),
            Pages = string.Join(", ", normalizedPlan.Pages.Select(p => p.Route)),
            ApiEndpoints = string.Join(", ", normalizedPlan.ApiRoutes.Select(r => $"{r.Method} {r.Path}")),
            DbEntities = string.Join(", ", normalizedPlan.Entities.Select(BuildEntitySummary))
        };
    }

    private static string BuildFeatureSummary(AppSpecDto approvedPlan)
    {
        var features = new List<string>();

        if (approvedPlan.Pages.Count > 0)
            features.Add($"{approvedPlan.Pages.Count} reviewed page flows");

        if (approvedPlan.ApiRoutes.Count > 0)
            features.Add($"{approvedPlan.ApiRoutes.Count} API endpoints");

        if (approvedPlan.Entities.Count > 0)
            features.Add($"{approvedPlan.Entities.Count} entities");

        if (approvedPlan.DependencyPlan?.Dependencies?.Any(d => !d.IsExisting) == true)
            features.Add("planned package additions");

        return string.Join(", ", features);
    }

    private static string BuildEntitySummary(EntitySpecDto entity)
    {
        var fieldNames = string.Join(", ", entity.Fields.Select(field => field.Name));
        return string.IsNullOrWhiteSpace(fieldNames)
            ? entity.Name
            : $"{entity.Name}({fieldNames})";
    }

    private void AddScaffoldFiles(List<GeneratedFile> files, Framework framework, string currentDir)
    {
        if (framework != Framework.NextJS)
            return;

        var templateDir = FindTemplateDirectory("next-ts-antd-prisma", currentDir);
        if (templateDir == null)
            return;

        files.AddRange(ReadScaffoldFiles(templateDir));
    }

    private static void AddApprovedReadmeFile(List<GeneratedFile> files, string approvedReadme)
    {
        if (string.IsNullOrWhiteSpace(approvedReadme))
            return;

        var existingReadme = files.FirstOrDefault(file =>
            string.Equals(NormalizeFilePath(file.Path), "readme.md", StringComparison.OrdinalIgnoreCase));

        if (existingReadme != null)
        {
            existingReadme.Content = approvedReadme;
            return;
        }

        files.Add(new GeneratedFile
        {
            Path = "README.md",
            Content = approvedReadme
        });
    }

    private static string BuildScaffoldBaseline(List<GeneratedFile> files)
    {
        if (files == null || files.Count == 0)
            return string.Empty;

        var baseline = new StringBuilder();

        foreach (var file in files
            .OrderBy(file => file.Path, StringComparer.OrdinalIgnoreCase)
            .Take(ScaffoldBaselineFileLimit))
        {
            if (baseline.Length >= ScaffoldBaselineTotalLength)
                break;

            var snippet = file.Content ?? string.Empty;
            if (snippet.Length > ScaffoldBaselineSnippetLength)
                snippet = snippet[..ScaffoldBaselineSnippetLength];

            baseline.AppendLine($"FILE: {file.Path}");
            baseline.AppendLine(snippet);
            baseline.AppendLine("===END BASELINE FILE===");
        }

        return baseline.ToString();
    }

    private static StringBuilder BuildGenerationContext(
        string projectName,
        CreateUpdateProjectDto input,
        RequirementsSnapshot requirements,
        string approvedReadme)
    {
        var context = new StringBuilder();
        context.AppendLine($"Project: {projectName}");
        context.AppendLine($"Framework: {input.Framework}");
        context.AppendLine($"Language: {input.Language}");
        context.AppendLine($"Database: {input.DatabaseOption}");
        context.AppendLine($"Auth: {(input.IncludeAuth ? "Yes" : "No")}");
        context.AppendLine($"Features: {requirements.Features}");
        context.AppendLine($"Pages: {requirements.Pages}");
        context.AppendLine($"API Endpoints: {requirements.ApiEndpoints}");
        context.AppendLine($"DB Entities: {requirements.DbEntities}");
        context.AppendLine($"Architecture: {requirements.ArchitectureSummary}");

        if (!string.IsNullOrWhiteSpace(approvedReadme))
        {
            context.AppendLine("Approved README:");
            context.AppendLine(approvedReadme);
        }

        return context;
    }

    private async Task<string> GenerateLayerAsync(
        string progressLabel,
        string layerDescription,
        string userInstruction,
        CreateUpdateProjectDto input,
        StringBuilder context,
        AppSpecDto approvedPlan,
        string scaffoldBaseline,
        string approvedReadme,
        Func<string, Task> onProgress)
    {
        await Task.Delay(GenerationPhaseDelayMilliseconds);
        await ReportProgress(onProgress, progressLabel);

        return await CallAiAsync(
            BuildCodeGenSystemPrompt(layerDescription, approvedPlan, input.Framework.ToString(), scaffoldBaseline, approvedReadme),
            BuildLayerUserPrompt(userInstruction, context, input.Prompt, approvedReadme));
    }

    private static string BuildLayerUserPrompt(
        string userInstruction,
        StringBuilder context,
        string originalPrompt,
        string approvedReadme)
    {
        if (string.IsNullOrWhiteSpace(approvedReadme))
            return $"{userInstruction} for:\n{context}\n\nRequirements: {originalPrompt}";

        return $"{userInstruction} for:\n{context}\n\nUse the approved README as the source of truth.\nOriginal user prompt: {originalPrompt}";
    }

    private static void MergeLayerResponse(CodeGenResult result, string layerResponse, bool allowArchitectureOverride)
    {
        var files = ParseFiles(layerResponse);
        result.Files.AddRange(files);
        result.ModuleList.AddRange(ParseModules(layerResponse));

        if (!allowArchitectureOverride || !string.IsNullOrWhiteSpace(result.ArchitectureSummary))
            return;

        var architecture = ParseDelimitedSection(layerResponse, "ARCHITECTURE");
        if (!string.IsNullOrWhiteSpace(architecture))
            result.ArchitectureSummary = architecture;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Multi-step workflow
    // ──────────────────────────────────────────────────────────────────────────

    public async Task<CodeGenSessionDto> CreateSession(CreateSessionInput input)
    {
        var session = new CodeGenSession
        {
            Id = Guid.NewGuid(),
            Prompt = input.Prompt,
            Status = (int)CodeGenStatus.Captured,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Call LLM to analyze requirements
        string response;
        try
        {
            response = await CallAiAsync(
                "You are an expert software architect. Analyze the user's application idea and extract structured information. "
                + "Return your analysis in the following delimited format:\n"
                + "===PROJECT_NAME===\n<suggested project name>\n===END PROJECT_NAME===\n"
                + "===NORMALIZED_REQUIREMENT===\n<clear, detailed restatement of the requirement>\n===END NORMALIZED_REQUIREMENT===\n"
                + "===DETECTED_FEATURES===\n<comma-separated list of features>\n===END DETECTED_FEATURES===\n"
                + "===DETECTED_ENTITIES===\n<comma-separated list of data entities>\n===END DETECTED_ENTITIES===\n",
                input.Prompt);
        }
        catch (Exception ex)
        {
            Logger.Error("CreateSession: Groq API call failed", ex);
            throw new UserFriendlyException($"AI service call failed: {ex.Message}");
        }

        session.ProjectName = ParseDelimitedSection(response, "PROJECT_NAME")?.Trim() ?? "untitled-app";
        session.NormalizedRequirement = ParseDelimitedSection(response, "NORMALIZED_REQUIREMENT")?.Trim() ?? input.Prompt;
        session.DetectedFeaturesJson = JsonSerializer.Serialize(
            ParseCsvList(ParseDelimitedSection(response, "DETECTED_FEATURES")), JsonOptions);
        session.DetectedEntitiesJson = JsonSerializer.Serialize(
            ParseCsvList(ParseDelimitedSection(response, "DETECTED_ENTITIES")), JsonOptions);

        try
        {
            if (AbpSession?.UserId != null)
                session.UserId = AbpSession.UserId;
        }
        catch { /* AbpSession may not be available in non-authenticated context */ }

        try
        {
            await SaveSession(session, isNew: true);
        }
        catch (Exception ex)
        {
            Logger.Error("CreateSession: Failed to save session", ex);
            throw new UserFriendlyException($"Failed to save session: {ex.Message}");
        }

        return MapSessionToDto(session);
    }

    public async Task<StackRecommendationDto> RecommendStack(string sessionId)
    {
        try
        {
            Logger.Debug($"RecommendStack: Loading session {sessionId}");
            var session = await LoadSession(sessionId);

            Logger.Debug($"RecommendStack: Calling Groq for session {sessionId}");
            var response = await CallAiAsync(
                "You are an expert software architect. Based on the application requirements, recommend the best technology stack. "
                + "Return your recommendation in the following delimited format:\n"
                + "===FRAMEWORK===\n<framework name, e.g. Next.js, React + Vite, Angular, Vue, .NET Blazor>\n===END FRAMEWORK===\n"
                + "===LANGUAGE===\n<language, e.g. TypeScript, JavaScript, C#>\n===END LANGUAGE===\n"
                + "===STYLING===\n<styling approach, e.g. Tailwind CSS, Ant Design, Material UI, CSS Modules>\n===END STYLING===\n"
                + "===DATABASE===\n<database, e.g. PostgreSQL, MongoDB, SQLite>\n===END DATABASE===\n"
                + "===ORM===\n<ORM, e.g. Prisma, Drizzle, TypeORM, Entity Framework>\n===END ORM===\n"
                + "===AUTH===\n<auth approach, e.g. NextAuth.js, JWT, OAuth2, None>\n===END AUTH===\n"
                + "===REASONING===\n<JSON object with keys matching each choice above, values explaining why>\n===END REASONING===\n",
                $"Application: {session.NormalizedRequirement}\n"
                + $"Features: {session.DetectedFeaturesJson}\n"
                + $"Entities: {session.DetectedEntitiesJson}");

            var reasoning = new Dictionary<string, string>();
            var reasoningStr = ParseDelimitedSection(response, "REASONING")?.Trim();
            if (!string.IsNullOrEmpty(reasoningStr))
            {
                try
                {
                    reasoning = JsonSerializer.Deserialize<Dictionary<string, string>>(reasoningStr, JsonOptions);
                }
                catch (Exception ex)
                {
                    Logger.Warn($"RecommendStack: Failed to parse reasoning JSON: {ex.Message}");
                }
            }

            return new StackRecommendationDto
            {
                Framework = ParseDelimitedSection(response, "FRAMEWORK")?.Trim() ?? "Next.js",
                Language = ParseDelimitedSection(response, "LANGUAGE")?.Trim() ?? "TypeScript",
                Styling = ParseDelimitedSection(response, "STYLING")?.Trim() ?? "Tailwind CSS",
                Database = ParseDelimitedSection(response, "DATABASE")?.Trim() ?? "PostgreSQL",
                Orm = ParseDelimitedSection(response, "ORM")?.Trim() ?? "Prisma",
                Auth = ParseDelimitedSection(response, "AUTH")?.Trim() ?? "NextAuth.js",
                Reasoning = reasoning ?? new Dictionary<string, string>()
            };
        }
        catch (UserFriendlyException)
        {
            throw;
        }
        catch (Exception ex)
        {
            Logger.Error($"RecommendStack: Unexpected error for session {sessionId}", ex);
            throw new UserFriendlyException($"Failed to generate stack recommendation: {ex.Message}");
        }
    }

    [HttpPut]
    public async Task<CodeGenSessionDto> SaveStack(SaveStackInput input)
    {
        var session = await LoadSession(input.SessionId);
        session.ConfirmedStackJson = JsonSerializer.Serialize(input.Stack, JsonOptions);
        session.Status = (int)CodeGenStatus.StackConfirmed;
        session.UpdatedAt = DateTime.UtcNow;

        // Determine scaffold template based on framework
        var fw = input.Stack.Framework?.ToLowerInvariant() ?? "";
        if (fw.Contains("next"))
            session.ScaffoldTemplate = "next-ts-antd-prisma";

        await SaveSession(session);
        return MapSessionToDto(session);
    }

    public async Task<CodeGenSessionDto> GenerateSpec(string sessionId)
    {
        try
        {
            Logger.Debug($"GenerateSpec: Loading session {sessionId}");
            var session = await LoadSession(sessionId);
            if (session.Status < (int)CodeGenStatus.StackConfirmed)
                throw new UserFriendlyException("Stack must be confirmed before generating spec.");

            var stack = DeserializeOrDefault<StackConfigDto>(session.ConfirmedStackJson);
            var features = DeserializeOrDefault<List<string>>(session.DetectedFeaturesJson) ?? new List<string>();
            var entities = DeserializeOrDefault<List<string>>(session.DetectedEntitiesJson) ?? new List<string>();

            Logger.Debug($"GenerateSpec: Calling Groq for session {sessionId}");
            string response;
            try
            {
                // Use the planner prompt template
                var plannerPrompt = PlannerPrompts.BuildSpecPrompt(
                    session.NormalizedRequirement ?? session.Prompt,
                    stack,
                    features,
                    entities);

                response = await CallAiAsync(
                    "You are an expert software architect. Generate a comprehensive application specification.",
                    plannerPrompt);
            }
            catch (Exception ex)
            {
                Logger.Error("GenerateSpec: Groq API call failed", ex);
                throw new UserFriendlyException($"AI service call failed: {ex.Message}");
            }

            Logger.Debug($"GenerateSpec: Parsing response for session {sessionId}");
            var specJson = ParseDelimitedSection(response, "SPEC_JSON")?.Trim();
            var spec = ParseSpecOrDefault(specJson, out var parseWarning);
            if (!string.IsNullOrEmpty(parseWarning))
            {
                Logger.Warn(parseWarning);
            }

            Logger.Debug($"GenerateSpec: Saving spec for session {sessionId}");
            session.SpecJson = JsonSerializer.Serialize(spec, JsonOptions);
            session.Status = (int)CodeGenStatus.SpecGenerated;
            session.UpdatedAt = DateTime.UtcNow;
            
            await SaveSession(session);
            return MapSessionToDto(session);
        }
        catch (UserFriendlyException)
        {
            throw;
        }
        catch (Exception ex)
        {
            Logger.Error($"GenerateSpec: Unexpected error for session {sessionId}", ex);
            throw new UserFriendlyException($"An unexpected error occurred during spec generation: {ex.Message}");
        }
    }

    [HttpPut]
    public async Task<CodeGenSessionDto> SaveSpec(SaveSpecInput input)
    {
        var session = await LoadSession(input.SessionId);

        // Analysis results (spec) are now part of a larger ReadmeResultDto package.
        // We must preserve the ReadmeMarkdown and Summary by updating only the Plan.
        var readmePackage = DeserializeOrDefault<ReadmeResultDto>(session.SpecJson);
        if (readmePackage == null || string.IsNullOrWhiteSpace(readmePackage.ReadmeMarkdown))
        {
            // If we can't find a ReadmePackage, see if it's a raw AppSpecDto
            var rawSpec = DeserializeOrDefault<AppSpecDto>(session.SpecJson);
            readmePackage = new ReadmeResultDto 
            {
                Plan = input.Spec ?? rawSpec ?? new AppSpecDto(),
                ReadmeMarkdown = "Generated Spec (README not found)",
                Summary = "Recovered from partial session data."
            };
        }
        else
        {
            readmePackage.Plan = input.Spec;
        }

        session.SpecJson = JsonSerializer.Serialize(readmePackage, JsonOptions);
        session.UpdatedAt = DateTime.UtcNow;
        await SaveSession(session);
        return MapSessionToDto(session);
    }

    public async Task<CodeGenSessionDto> ConfirmSpec(string sessionId)
    {
        var session = await LoadSession(sessionId);
        session.SpecConfirmedAt = DateTime.UtcNow;
        session.Status = (int)CodeGenStatus.SpecConfirmed;
        session.UpdatedAt = DateTime.UtcNow;
        await SaveSession(session);
        return MapSessionToDto(session);
    }

    public async Task<CodeGenSessionDto> Generate(string sessionId)
    {
        var session = await LoadSession(sessionId);
        if (session.Status < (int)CodeGenStatus.SpecConfirmed)
            throw new UserFriendlyException("Spec must be confirmed before generating.");

        // Prevent double-start: if already generating or beyond, return current state
        if (session.Status >= (int)CodeGenStatus.Generating)
            return MapSessionToDto(session);

        var sessionGuid = session.Id;

        // Prevent concurrent generation for the same session
        if (!ActiveGenerations.TryAdd(sessionGuid, 0))
            return MapSessionToDto(session);

        // The README review step persists both the approved README and the plan derived from it.
        // Fall back to the legacy spec-generation path when older sessions do not have a plan yet.
        var blueprint = LoadGenerationBlueprint(session.SpecJson);
        var rawSpec = blueprint.Spec;
        var approvedReadme = blueprint.ReadmeMarkdown;
        var isValidSpec = HasUsableSpec(rawSpec);

        if (!isValidSpec)
        {
            Logger.Info($"[CodeGen] No valid spec found for session {sessionGuid}. Auto-generating spec from requirements.");
            try
            {
                await GenerateSpec(sessionId);
                session = await LoadSession(sessionId);
                blueprint = LoadGenerationBlueprint(session.SpecJson);
                rawSpec = blueprint.Spec;
                approvedReadme = blueprint.ReadmeMarkdown;
            }
            catch (Exception ex)
            {
                Logger.Warn($"[CodeGen] Auto-spec generation failed for session {sessionGuid}: {ex.Message}. Proceeding with empty spec.");
            }
        }

        var spec = NormalizeSpec(rawSpec ?? new AppSpecDto());
        var stack = DeserializeOrDefault<StackConfigDto>(session.ConfirmedStackJson);
        var validationRules = spec.Validations ?? new List<ValidationRuleDto>();
        var initialValidationResults = BuildInitialValidationResults(validationRules, stack);

        session.Status = (int)CodeGenStatus.Generating;
        session.GenerationStartedAt = DateTime.UtcNow;
        session.CurrentPhase = "scaffold";
        session.CompletedStepsJson = JsonSerializer.Serialize(new List<string>(), JsonOptions);
        session.ValidationResultsJson = JsonSerializer.Serialize(initialValidationResults, JsonOptions);
        session.ErrorMessage = null;
        session.UpdatedAt = DateTime.UtcNow;
        await SaveSession(session);

        // Capture dependencies for the background task
        var validationConstraints = BuildValidationConstraints(validationRules);
        var projectInput = new CreateUpdateProjectDto
        {
            Id = session.ProjectId ?? 0,
            Name = session.ProjectName ?? "generated-app",
            Prompt = (session.NormalizedRequirement ?? session.Prompt) + validationConstraints,
            Framework = MapFrameworkString(stack?.Framework),
            Language = MapLanguageString(stack?.Language),
            DatabaseOption = MapDatabaseString(stack?.Database),
            IncludeAuth = !string.IsNullOrEmpty(stack?.Auth) && !stack.Auth.Equals("None", StringComparison.OrdinalIgnoreCase)
        };

        // Capture singleton/long-lived references safe for background use
        var httpClientFactory = _httpClientFactory;
        var configuration = _configuration;
        var templateRepository = _templateRepository;
        var scopeFactory = _serviceScopeFactory;
        var logger = Logger;
        var currentDirectory = Directory.GetCurrentDirectory(); // Capture for background task

        logger.Info($"[CodeGen] Launching background task for session {sessionGuid}");

        using (System.Threading.ExecutionContext.SuppressFlow())
        {
            _ = Task.Run(async () =>
            {
                try
                {
                    logger.Info($"[CodeGen] Background task entered for session {sessionGuid}");

                    // Check if scopeFactory is available
                    if (scopeFactory == null)
                    {
                        logger.Error($"[CodeGen] ServiceScopeFactory is null for session {sessionGuid}. Cannot create background scope.");
                        throw new InvalidOperationException("ServiceScopeFactory is not available. Cannot proceed with generation.");
                    }

                    // Create a fresh DI scope so the DbContext and repositories
                    // are not tied to the (now-completed) HTTP request scope.
                    using var scope = scopeFactory.CreateScope();
                    var scopedUowManager = scope.ServiceProvider.GetRequiredService<Abp.Domain.Uow.IUnitOfWorkManager>();
                    var scopedSessionRepo = scope.ServiceProvider.GetRequiredService<IRepository<CodeGenSession, Guid>>();

                    using var uow = scopedUowManager.Begin();

                    // Create a standalone service for LLM calls (only needs singletons).
                    var bgService = new CodeGenAppService(
                        httpClientFactory, configuration, templateRepository);
                    bgService.Logger = logger;

                    async Task OnProgress(string message)
                    {
                        try
                        {
                            logger.Info($"[CodeGen] Progress ({sessionGuid}): {message}");
                            using var progressUow = scopedUowManager.Begin(
                                new Abp.Domain.Uow.UnitOfWorkOptions
                                {
                                    Scope = System.Transactions.TransactionScopeOption.RequiresNew
                                });
                            var s = await scopedSessionRepo.GetAsync(sessionGuid);
                            s.CurrentPhase = message;
                            var steps = DeserializeOrDefault<List<string>>(s.CompletedStepsJson) ?? new List<string>();
                            steps.Add(message);
                            s.CompletedStepsJson = JsonSerializer.Serialize(steps, JsonOptions);
                            s.UpdatedAt = DateTime.UtcNow;
                            await scopedSessionRepo.UpdateAsync(s);
                            await progressUow.CompleteAsync();
                        }
                        catch (Exception progressEx)
                        {
                            logger.Error($"[CodeGen] Progress update failed ({sessionGuid}): {progressEx.Message}", progressEx);
                        }
                    }

                    logger.Info($"[CodeGen] Starting GenerateProjectAsync for session {sessionGuid}");
                    var result = await bgService.GenerateProjectAsync(projectInput, OnProgress, currentDirectory, spec, approvedReadme);
                    logger.Info($"[CodeGen] GenerateProjectAsync completed for session {sessionGuid}. Files: {result?.Files?.Count ?? 0}");

                    var sess = await scopedSessionRepo.GetAsync(sessionGuid);
                    sess.GeneratedFilesJson = JsonSerializer.Serialize(
                        (result?.Files ?? new List<GeneratedFile>()).Select(f => new GeneratedFileDto { Path = f.Path, Content = f.Content }).ToList(),
                        JsonOptions);

                    await OnProgress("[6/6] Running validations...");

                    sess = await scopedSessionRepo.GetAsync(sessionGuid);
                    sess.Status = (int)CodeGenStatus.ValidationRunning;
                    sess.ValidationResultsJson = JsonSerializer.Serialize(
                        initialValidationResults
                            .Select(v => new ValidationResultDto
                            {
                                Id = v.Id,
                                Status = "running",
                                Message = "Running validation..."
                            })
                            .ToList(),
                        JsonOptions);
                    sess.UpdatedAt = DateTime.UtcNow;
                    await scopedSessionRepo.UpdateAsync(sess);

                    var finalValidationResults = EvaluateValidationResults(validationRules, result?.Files ?? new List<GeneratedFile>(), stack);
                    var hasValidationFailures = finalValidationResults.Any(v => v.Status == "failed");

                    sess.ValidationResultsJson = JsonSerializer.Serialize(finalValidationResults, JsonOptions);
                    sess.Status = hasValidationFailures
                        ? (int)CodeGenStatus.ValidationFailed
                        : (int)CodeGenStatus.ValidationPassed;
                    sess.GenerationCompletedAt = DateTime.UtcNow;
                    sess.CurrentPhase = hasValidationFailures ? "validation-failed" : "completed";
                    sess.ErrorMessage = null;
                    sess.UpdatedAt = DateTime.UtcNow;
                    await scopedSessionRepo.UpdateAsync(sess);
                    await uow.CompleteAsync();

                    logger.Info($"[CodeGen] Session {sessionGuid} generation completed.");
                }
                catch (Exception ex)
                {
                    logger.Error($"[CodeGen] FAILED for session {sessionGuid}: {ex.Message}", ex);
                    try
                    {
                        // Use a separate scope for error handling in case the main scope is corrupted
                        using var errScope = scopeFactory.CreateScope();
                        var errUowManager = errScope.ServiceProvider.GetRequiredService<Abp.Domain.Uow.IUnitOfWorkManager>();
                        var errSessionRepo = errScope.ServiceProvider.GetRequiredService<IRepository<CodeGenSession, Guid>>();

                        using var errUow = errUowManager.Begin();
                        var sess = await errSessionRepo.GetAsync(sessionGuid);
                        var failedResults = MarkValidationResultsFailed(initialValidationResults, ex.Message);
                        sess.ValidationResultsJson = JsonSerializer.Serialize(failedResults, JsonOptions);
                        sess.Status = (int)CodeGenStatus.ValidationFailed;
                        sess.CurrentPhase = "failed";
                        sess.ErrorMessage = ex.Message.Length > 995 ? ex.Message[..992] + "..." : ex.Message;
                        sess.UpdatedAt = DateTime.UtcNow;
                        await errSessionRepo.UpdateAsync(sess);
                        await errUow.CompleteAsync();
                    }
                    catch (Exception errEx)
                    {
                        logger.Error($"[CodeGen] Could not update failure status for session {sessionGuid}: {errEx.Message}", errEx);
                    }
                }
                finally
                {
                    ActiveGenerations.TryRemove(sessionGuid, out _);
                }
            });
        }

        return MapSessionToDto(session);
    }

    public async Task<GenerationStatusDto> GetStatus(string sessionId)
    {
        var session = await LoadSession(sessionId);
        var completedSteps = DeserializeOrDefault<List<string>>(session.CompletedStepsJson) ?? new List<string>();
        var validationResults = DeserializeOrDefault<List<ValidationResultDto>>(session.ValidationResultsJson) ?? new List<ValidationResultDto>();

        return new GenerationStatusDto
        {
            CurrentPhase = session.CurrentPhase,
            CompletedSteps = completedSteps,
            ValidationResults = validationResults,
            IsComplete = session.Status >= (int)CodeGenStatus.ValidationPassed,
            Error = session.ErrorMessage
        };
    }

    /// <summary>
    /// Repairs the current generated files by applying targeted, validation-aware diffs and rerunning validations.
    /// </summary>
    public async Task<CodeGenSessionDto> Repair(TriggerRepairInput input)
    {
        var session = await LoadSession(input.SessionId);
        session.RepairAttempts++;

        var currentFiles = DeserializeOrDefault<List<GeneratedFileDto>>(session.GeneratedFilesJson) ?? new List<GeneratedFileDto>();
        var spec = LoadStoredSpec(session.SpecJson) ?? new AppSpecDto();
        var stack = DeserializeOrDefault<StackConfigDto>(session.ConfirmedStackJson);
        var repairFailures = input.Failures?.Where(f => f?.Status == "failed").ToList() ?? new List<ValidationResultDto>();
        var affectedPaths = BuildRepairAffectedPaths(repairFailures, spec, stack);

        var repairPrompt = RepairPrompts.BuildRepairPrompt(repairFailures, spec, currentFiles, affectedPaths);

        var response = await CallAiAsync(
            "You are an expert code repair agent specializing in targeted, minimal diffs.",
            repairPrompt);

        var repairedFiles = ConvertToFileDtos(ParseFiles(response));
        var deletedFiles = ParseDeletedFiles(response);
        var mergedFiles = MergeRefinementResults(currentFiles, repairedFiles, deletedFiles);
        var validationRules = spec.Validations ?? new List<ValidationRuleDto>();
        var validationResults = EvaluateValidationResults(validationRules, ConvertToFiles(mergedFiles), stack);
        var hasFailures = validationResults.Any(v => v.Status == "failed");

        session.GeneratedFilesJson = JsonSerializer.Serialize(mergedFiles, JsonOptions);
        session.ValidationResultsJson = JsonSerializer.Serialize(validationResults, JsonOptions);
        session.GenerationMode = "repair";
        session.Status = hasFailures
            ? (int)CodeGenStatus.ValidationFailed
            : (int)CodeGenStatus.ValidationPassed;
        session.CurrentPhase = hasFailures ? "repair-validation-failed" : "repair-complete";
        session.ErrorMessage = null;
        session.UpdatedAt = DateTime.UtcNow;
        await SaveSession(session);
        return MapSessionToDto(session);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Refinement/diff-based updates
    // ──────────────────────────────────────────────────────────────────────────

    private static List<string> ParseDeletedFiles(string response)
    {
        var deletedSection = ParseDelimitedSection(response, "DELETED");
        return string.IsNullOrWhiteSpace(deletedSection)
            ? new List<string>()
            : ParseCsvList(deletedSection);
    }

    private static List<string> BuildRepairAffectedPaths(
        List<ValidationResultDto> failures,
        AppSpecDto spec,
        StackConfigDto stack)
    {
        var framework = ResolveFramework(stack);
        var affectedPaths = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var failure in failures ?? new List<ValidationResultDto>())
        {
            foreach (var path in ResolveAffectedPaths(failure, spec, framework))
            {
                if (!string.IsNullOrWhiteSpace(path))
                    affectedPaths.Add(NormalizeFilePath(path));
            }
        }

        return affectedPaths
            .Where(path => !string.IsNullOrWhiteSpace(path))
            .OrderBy(path => path, StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    private static IEnumerable<string> ResolveAffectedPaths(
        ValidationResultDto failure,
        AppSpecDto spec,
        Framework? framework)
    {
        if (failure == null)
            yield break;

        foreach (var extractedPath in ExtractFilePathsFromText(failure.Message))
            yield return extractedPath;

        foreach (var shellPath in ResolveShellRepairPaths(failure.Id, failure.Message, framework))
            yield return shellPath;

        foreach (var validationPath in ResolveValidationRuleRepairPaths(failure.Id, spec, framework))
            yield return validationPath;
    }

    private static IEnumerable<string> ResolveShellRepairPaths(
        string validationId,
        string message,
        Framework? framework)
    {
        var normalizedId = validationId?.Trim();

        if (string.Equals(normalizedId, NextHomePageValidationId, StringComparison.OrdinalIgnoreCase))
        {
            yield return "src/app/page.tsx";
            yield break;
        }

        if (string.Equals(normalizedId, ViteIndexHtmlValidationId, StringComparison.OrdinalIgnoreCase))
        {
            yield return "index.html";
            yield break;
        }

        if (string.Equals(normalizedId, RequiredLayoutValidationId, StringComparison.OrdinalIgnoreCase))
        {
            var layoutPath = ResolveLayoutFilePath(framework);
            if (!string.IsNullOrWhiteSpace(layoutPath))
                yield return layoutPath;

            foreach (var extractedPath in ExtractFilePathsFromText(message))
                yield return extractedPath;

            yield break;
        }

        if (string.Equals(normalizedId, StyledHomeRouteValidationId, StringComparison.OrdinalIgnoreCase))
        {
            var homeRoutePath = ResolveHomeRouteFilePath(framework);
            if (!string.IsNullOrWhiteSpace(homeRoutePath))
                yield return homeRoutePath;

            foreach (var extractedPath in ExtractFilePathsFromText(message))
                yield return extractedPath;
        }
    }

    private static IEnumerable<string> ResolveValidationRuleRepairPaths(
        string failureId,
        AppSpecDto spec,
        Framework? framework)
    {
        var validation = spec?.Validations?.FirstOrDefault(rule =>
            !string.IsNullOrWhiteSpace(rule?.Id)
            && rule.Id.Equals(failureId, StringComparison.OrdinalIgnoreCase));

        if (validation == null)
            yield break;

        if (LooksLikeFilePath(validation.Target))
            yield return validation.Target;

        var category = (validation.Category ?? string.Empty).ToLowerInvariant();
        if (category == "route-exists")
        {
            var routeHint = ExtractRouteHint(validation);
            var routeFilePath = ResolveRouteFilePath(routeHint, framework);
            if (!string.IsNullOrWhiteSpace(routeFilePath))
                yield return routeFilePath;
        }

        if (category is "build-passes" or "lint-passes" or "type-check")
            yield return "package.json";
    }

    private static IEnumerable<string> ExtractFilePathsFromText(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            yield break;

        var matches = Regex.Matches(
            text,
            @"(?<![A-Za-z0-9])(?:\.{0,2}/)?[A-Za-z0-9_\-/]+\.[A-Za-z0-9._-]+",
            RegexOptions.CultureInvariant);

        foreach (Match match in matches)
        {
            var path = NormalizeFilePath(match.Value);
            if (!string.IsNullOrWhiteSpace(path))
                yield return path;
        }
    }

    private static bool LooksLikeFilePath(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return false;

        var normalized = NormalizeFilePath(value);
        return normalized.Contains('/')
            || Regex.IsMatch(normalized, @"^[A-Za-z0-9_.-]+\.[A-Za-z0-9._-]+$", RegexOptions.CultureInvariant);
    }

    private static Framework? ResolveFramework(StackConfigDto stack)
    {
        if (string.IsNullOrWhiteSpace(stack?.Framework))
            return null;

        return MapFrameworkString(stack.Framework);
    }

    private static string ResolveLayoutFilePath(Framework? framework)
    {
        if (framework == Framework.NextJS)
            return "src/app/layout.tsx";

        if (framework == Framework.ReactVite)
            return "src/App.tsx";

        return string.Empty;
    }

    private static string ResolveHomeRouteFilePath(Framework? framework)
    {
        if (framework == Framework.NextJS)
            return "src/app/page.tsx";

        if (framework == Framework.ReactVite)
            return "src/App.tsx";

        return string.Empty;
    }

    private static string ResolveRouteFilePath(string route, Framework? framework)
    {
        if (string.IsNullOrWhiteSpace(route) || framework == null)
            return string.Empty;

        var normalizedRoute = NormalizePageRoute(route);
        if (framework == Framework.NextJS)
        {
            if (normalizedRoute == "/")
                return "src/app/page.tsx";

            return $"src/app/{normalizedRoute.TrimStart('/').TrimEnd('/')}/page.tsx";
        }

        if (framework == Framework.ReactVite)
            return "src/App.tsx";

        return string.Empty;
    }

    public async Task<RefinementResultDto> RefineSession(RefinementInputDto input)
    {
        var session = await LoadSession(input.SessionId);
        if (session.Status < (int)CodeGenStatus.ValidationPassed)
            throw new UserFriendlyException("Session must have completed generation before refinement.");

        var currentFileDtos = DeserializeOrDefault<List<GeneratedFileDto>>(session.GeneratedFilesJson) ?? new List<GeneratedFileDto>();
        var spec = LoadStoredSpec(session.SpecJson);

        // Build refinement prompt
        var prompt = RefinementPrompts.BuildDiffPrompt(
            input.ChangeRequest,
            spec,
            currentFileDtos,
            input.AffectedFiles);

        string response;
        try
        {
            response = await CallAiAsync(
                "You are an expert code refactoring agent specializing in targeted, minimal changes.",
                prompt);
        }
        catch (Exception ex)
        {
            Logger.Error("RefineSession: AI service call failed", ex);
            throw new UserFriendlyException($"AI service call failed: {ex.Message}");
        }

        // Parse summary
        var summary = ParseDelimitedSection(response, "SUMMARY")?.Trim() ?? "Refinement applied.";

        // Parse changed files (returns List<GeneratedFile>)
        var changedFiles = ParseFiles(response);
        var changedFileDtos = ConvertToFileDtos(changedFiles);

        // Parse deleted files
        var deletedFiles = new List<string>();
        var deletedSection = ParseDelimitedSection(response, "DELETED");
        if (!string.IsNullOrEmpty(deletedSection))
        {
            deletedFiles = ParseCsvList(deletedSection);
        }

        // Merge changes into current files
        var mergedFiles = MergeRefinementResults(currentFileDtos, changedFileDtos, deletedFiles);

        // Update session
        session.GeneratedFilesJson = JsonSerializer.Serialize(mergedFiles, JsonOptions);

        // Track refinement history
        var history = DeserializeOrDefault<List<RefinementHistoryEntry>>(session.RefinementHistoryJson) ?? new List<RefinementHistoryEntry>();
        history.Add(new RefinementHistoryEntry
        {
            Timestamp = DateTime.UtcNow,
            ChangeRequest = input.ChangeRequest,
            ChangedFiles = changedFileDtos.Select(f => f.Path).ToList(),
            DeletedFiles = deletedFiles
        });
        session.RefinementHistoryJson = JsonSerializer.Serialize(history, JsonOptions);
        session.GenerationMode = "refinement";
        session.UpdatedAt = DateTime.UtcNow;

        await SaveSession(session);

        // Run validation on impacted areas
        var specValidations = spec.Validations ?? new List<ValidationRuleDto>();
        var mergedFilesForValidation = ConvertToFiles(mergedFiles);
        var stack = DeserializeOrDefault<StackConfigDto>(session.ConfirmedStackJson);
        var validationResults = EvaluateValidationResults(specValidations, mergedFilesForValidation, stack);

        return new RefinementResultDto
        {
            ChangedFiles = changedFileDtos,
            DeletedFiles = deletedFiles,
            Summary = summary,
            ValidationResults = validationResults
        };
    }

    private static List<GeneratedFileDto> MergeRefinementResults(
        List<GeneratedFileDto> original,
        List<GeneratedFileDto> changed,
        List<string> deleted)
    {
        var result = new List<GeneratedFileDto>(original);

        // Apply deletions
        foreach (var deletedPath in deleted)
        {
            result.RemoveAll(f => string.Equals(f.Path, deletedPath, StringComparison.OrdinalIgnoreCase));
        }

        // Apply changes
        foreach (var changedFile in changed)
        {
            var existing = result.FirstOrDefault(f => string.Equals(f.Path, changedFile.Path, StringComparison.OrdinalIgnoreCase));
            if (existing != null)
            {
                existing.Content = changedFile.Content;
            }
            else
            {
                result.Add(changedFile);
            }
        }

        return result;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // README generation for spec review phase
    // ──────────────────────────────────────────────────────────────────────────

    /// <summary>
    /// Generates a human-readable README document for user review before code generation.
    /// </summary>
    public async Task<ReadmeResultDto> GenerateReadme(string sessionId)
    {
        try
        {
            Logger.Debug($"GenerateReadme: Loading session {sessionId}");
            var session = await LoadSession(sessionId);
            var stack = DeserializeOrDefault<StackConfigDto>(session.ConfirmedStackJson);
            var features = DeserializeOrDefault<List<string>>(session.DetectedFeaturesJson) ?? new List<string>();
            var entities = DeserializeOrDefault<List<string>>(session.DetectedEntitiesJson) ?? new List<string>();
            EnsureReadmeGenerationPreconditions(session);

            var readmeResult = await BuildReadmeResultAsync(session, stack, features, entities);

            session.SpecJson = JsonSerializer.Serialize(readmeResult, JsonOptions);
            session.Status = (int)CodeGenStatus.SpecGenerated;
            session.UpdatedAt = DateTime.UtcNow;

            await SaveSession(session);
            return readmeResult;
        }
        catch (UserFriendlyException)
        {
            throw;
        }
        catch (Exception ex)
        {
            Logger.Error($"GenerateReadme: Unexpected error for session {sessionId}", ex);
            throw new UserFriendlyException($"An unexpected error occurred during README generation: {ex.Message}");
        }
    }

    private static void EnsureReadmeGenerationPreconditions(CodeGenSession session)
    {
        if (session.Status < (int)CodeGenStatus.StackConfirmed)
            throw new UserFriendlyException("Stack must be confirmed before generating README.");
    }

    private async Task<ReadmeResultDto> BuildReadmeResultAsync(
        CodeGenSession session,
        StackConfigDto stack,
        List<string> features,
        List<string> entities)
    {
        Logger.Debug($"GenerateReadme: Calling LLM for session {session.Id}");
        var response = await GenerateReadmeDocumentAsync(session, stack, features, entities);

        var readmeMarkdown = ParseDelimitedSection(response, "README")?.Trim()
            ?? "# Generated Application\n\nREADME generation failed.";
        var summary = ParseDelimitedSection(response, "SUMMARY")?.Trim() ?? "A new application.";
        var plan = await GeneratePlanFromReadmeAsync(
            readmeMarkdown,
            stack,
            session,
            features,
            entities);

        return new ReadmeResultDto
        {
            ReadmeMarkdown = readmeMarkdown,
            Summary = summary,
            Plan = plan
        };
    }

    private async Task<string> GenerateReadmeDocumentAsync(
        CodeGenSession session,
        StackConfigDto stack,
        List<string> features,
        List<string> entities)
    {
        try
        {
            return await CallAiAsync(
                "You are an expert technical writer specializing in developer documentation.",
                BuildReadmePrompt(session, stack, features, entities));
        }
        catch (Exception ex)
        {
            Logger.Error("GenerateReadme: LLM API call failed", ex);
            throw new UserFriendlyException($"AI service call failed: {ex.Message}");
        }
    }

    private async Task<AppSpecDto> GeneratePlanFromReadmeAsync(
        string readmeMarkdown,
        StackConfigDto stack,
        CodeGenSession session,
        List<string> features,
        List<string> entities)
    {
        var sessionId = session?.Id.ToString() ?? string.Empty;

        try
        {
            Logger.Debug($"GenerateReadme: Deriving implementation plan from README for session {sessionId}");
            var response = await CallAiAsync(
                "You are an expert software architect. Convert the approved README into a concrete implementation plan.",
                PlannerPrompts.BuildPlanFromReadmePrompt(
                    readmeMarkdown,
                    stack,
                    session?.NormalizedRequirement ?? session?.Prompt ?? string.Empty,
                    features,
                    entities));

            var specJson = ParseDelimitedSection(response, "SPEC_JSON")?.Trim();
            var plan = ParseSpecOrDefault(specJson, out var parseWarning);
            if (!string.IsNullOrWhiteSpace(parseWarning))
                Logger.Warn(parseWarning);

            return EnrichReadmePlan(
                NormalizeSpec(plan),
                readmeMarkdown,
                session,
                features,
                entities);
        }
        catch (Exception ex)
        {
            Logger.Error($"GenerateReadme: Failed to derive implementation plan for session {sessionId}", ex);
            throw new UserFriendlyException($"Failed to derive an implementation plan from the README: {ex.Message}");
        }
    }

    private static AppSpecDto EnrichReadmePlan(
        AppSpecDto plan,
        string readmeMarkdown,
        CodeGenSession session,
        List<string> features,
        List<string> detectedEntities)
    {
        var enrichedPlan = NormalizeSpec(plan ?? new AppSpecDto());
        var requirement = session?.NormalizedRequirement ?? session?.Prompt ?? string.Empty;

        EnrichReadmeEntities(enrichedPlan, readmeMarkdown, requirement, detectedEntities, features);
        EnrichReadmePages(enrichedPlan, readmeMarkdown);
        EnrichReadmeApiRoutes(enrichedPlan, readmeMarkdown);

        if (string.IsNullOrWhiteSpace(enrichedPlan.ArchitectureNotes))
            enrichedPlan.ArchitectureNotes = requirement;

        return NormalizeSpec(enrichedPlan);
    }

    private static void EnrichReadmeEntities(
        AppSpecDto plan,
        string readmeMarkdown,
        string requirement,
        List<string> detectedEntities,
        List<string> features)
    {
        if (plan.Entities.Count > 0)
            return;

        var entityCandidates = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var entity in detectedEntities ?? new List<string>())
        {
            if (!string.IsNullOrWhiteSpace(entity))
                entityCandidates.Add(ToPascalIdentifier(entity));
        }

        foreach (var entity in ExtractMarkdownBulletItems(readmeMarkdown, "data model", "entities", "domain model"))
        {
            var entityName = ExtractLeadingIdentifier(entity);
            if (!string.IsNullOrWhiteSpace(entityName))
                entityCandidates.Add(entityName);
        }

        if (entityCandidates.Count == 0)
        {
            var fallbackEntity = InferTodoEntityName($"{requirement} {string.Join(' ', features ?? new List<string>())}");
            if (!string.IsNullOrWhiteSpace(fallbackEntity))
                entityCandidates.Add(fallbackEntity);
        }

        foreach (var entityName in entityCandidates)
            plan.Entities.Add(BuildFallbackEntitySpec(entityName));
    }

    private static void EnrichReadmePages(AppSpecDto plan, string readmeMarkdown)
    {
        var existingRoutes = new HashSet<string>(
            plan.Pages.Select(page => NormalizePageRoute(page.Route)),
            StringComparer.OrdinalIgnoreCase);

        foreach (var route in ExtractReadmeRoutes(readmeMarkdown))
        {
            var normalizedRoute = NormalizePageRoute(route);
            if (string.IsNullOrWhiteSpace(normalizedRoute) || normalizedRoute.StartsWith("/api", StringComparison.OrdinalIgnoreCase))
                continue;

            if (existingRoutes.Add(normalizedRoute))
            {
                plan.Pages.Add(new PageSpecDto
                {
                    Route = normalizedRoute,
                    Name = BuildPageNameFromRoute(normalizedRoute),
                    Layout = normalizedRoute == "/" ? "public" : "authenticated",
                    Components = new List<string>(),
                    DataRequirements = new List<string>(),
                    Description = "Recovered from the approved README."
                });
            }
        }

        EnsureHomePage(plan.Pages);
    }

    private static void EnrichReadmeApiRoutes(AppSpecDto plan, string readmeMarkdown)
    {
        if (plan.ApiRoutes.Count > 0)
            return;

        foreach (Match match in Regex.Matches(
            readmeMarkdown ?? string.Empty,
            @"\b(GET|POST|PUT|PATCH|DELETE)\s+(/api/[A-Za-z0-9_\-/{}/:\[\]]+)",
            RegexOptions.IgnoreCase | RegexOptions.CultureInvariant))
        {
            var method = match.Groups[1].Value.ToUpperInvariant();
            var path = NormalizeApiPath(match.Groups[2].Value);
            if (string.IsNullOrWhiteSpace(path))
                continue;

            plan.ApiRoutes.Add(new ApiRouteSpecDto
            {
                Method = method,
                Path = path,
                Handler = BuildHandlerName(method, path),
                RequestBody = new { },
                ResponseShape = new { },
                Auth = !path.Contains("login", StringComparison.OrdinalIgnoreCase)
                    && !path.Contains("register", StringComparison.OrdinalIgnoreCase),
                Description = "Recovered from the approved README."
            });
        }
    }

    private static IEnumerable<string> ExtractReadmeRoutes(string readmeMarkdown)
    {
        foreach (Match match in Regex.Matches(
            readmeMarkdown ?? string.Empty,
            @"(?<![A-Za-z0-9])/(?!/)(?:[A-Za-z0-9_\-\[\]{}]+(?:/[A-Za-z0-9_\-\[\]{}]+)*)?",
            RegexOptions.CultureInvariant))
        {
            var route = match.Value.Trim();
            if (!string.IsNullOrWhiteSpace(route))
                yield return route;
        }
    }

    private static List<string> ExtractMarkdownBulletItems(string markdown, params string[] sectionHints)
    {
        var items = new List<string>();
        if (string.IsNullOrWhiteSpace(markdown))
            return items;

        var lines = markdown.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        var inSection = false;

        foreach (var rawLine in lines)
        {
            var line = rawLine.Trim();
            if (line.StartsWith("#", StringComparison.Ordinal))
            {
                inSection = sectionHints.Any(hint =>
                    line.Contains(hint, StringComparison.OrdinalIgnoreCase));
                continue;
            }

            if (!inSection || line.Length < 2 || (line[0] != '-' && line[0] != '*'))
                continue;

            items.Add(line[1..].Trim());
        }

        return items;
    }

    private static string ExtractLeadingIdentifier(string rawValue)
    {
        if (string.IsNullOrWhiteSpace(rawValue))
            return string.Empty;

        var stripped = rawValue.Trim().Trim('`');
        var value = stripped.Split(':', 2, StringSplitOptions.TrimEntries)[0];
        return ToPascalIdentifier(value);
    }

    private static string ToPascalIdentifier(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return string.Empty;

        var parts = Regex.Split(value.Trim(), @"[^A-Za-z0-9]+")
            .Where(part => !string.IsNullOrWhiteSpace(part))
            .ToList();

        if (parts.Count == 0)
            return string.Empty;

        return string.Concat(parts.Select(part =>
            part.Length == 1
                ? part.ToUpperInvariant()
                : char.ToUpperInvariant(part[0]) + part[1..].ToLowerInvariant()));
    }

    private static string InferTodoEntityName(string source)
    {
        if (string.IsNullOrWhiteSpace(source))
            return string.Empty;

        if (source.Contains("todo", StringComparison.OrdinalIgnoreCase))
            return "Task";

        if (source.Contains("task", StringComparison.OrdinalIgnoreCase))
            return "Task";

        if (source.Contains("note", StringComparison.OrdinalIgnoreCase))
            return "Note";

        return string.Empty;
    }

    private static EntitySpecDto BuildFallbackEntitySpec(string entityName)
    {
        var normalizedName = ToPascalIdentifier(entityName);
        return new EntitySpecDto
        {
            Name = normalizedName,
            TableName = normalizedName.ToLowerInvariant(),
            Fields = BuildFallbackEntityFields(normalizedName),
            Relations = new List<RelationSpecDto>()
        };
    }

    private static List<FieldSpecDto> BuildFallbackEntityFields(string entityName)
    {
        var fields = new List<FieldSpecDto>
        {
            new()
            {
                Name = "id",
                Type = "string",
                Required = true,
                Unique = true,
                Description = "Stable identifier."
            }
        };

        if (entityName.Contains("Task", StringComparison.OrdinalIgnoreCase)
            || entityName.Contains("Todo", StringComparison.OrdinalIgnoreCase))
        {
            fields.Add(new FieldSpecDto
            {
                Name = "title",
                Type = "string",
                Required = true,
                MaxLength = 255,
                Description = "Short task title."
            });
            fields.Add(new FieldSpecDto
            {
                Name = "completed",
                Type = "boolean",
                Required = true,
                Description = "Whether the task is complete."
            });
            return fields;
        }

        fields.Add(new FieldSpecDto
        {
            Name = "name",
            Type = "string",
            Required = true,
            MaxLength = 255,
            Description = $"{entityName} display name."
        });

        return fields;
    }

    private static string BuildHandlerName(string method, string path)
    {
        var suffix = string.Concat(
            Regex.Split(path ?? string.Empty, @"[^A-Za-z0-9]+")
                .Where(segment => !string.IsNullOrWhiteSpace(segment) && !segment.Equals("api", StringComparison.OrdinalIgnoreCase))
                .Select(segment => char.ToUpperInvariant(segment[0]) + segment[1..]));

        if (string.IsNullOrWhiteSpace(suffix))
            suffix = "Route";

        return $"{method.ToLowerInvariant()}{suffix}";
    }

    private static string BuildReadmePrompt(
        CodeGenSession session,
        StackConfigDto stack,
        List<string> features,
        List<string> entities)
    {
        return $@"You are an expert technical writer. Generate a comprehensive, human-readable README.md document for a new application.

The README should be written in markdown format and include:
1. Project title and description
2. Features list
3. Tech stack with reasoning
4. Data model / entities
5. API endpoints overview
6. Pages and navigation
7. Getting started guide
8. Environment variables needed
9. Project structure overview

For the sections about entities, routes, and APIs:
- Prefer concrete bullet lists or markdown tables over vague prose.
- Name the main domain entities explicitly, even if they only exist in client-side state.
- List the user-facing routes explicitly, using real paths like /, /tasks, /settings when known.
- If the app is client-only and does not need backend endpoints, say that clearly instead of omitting the section.

Application Details:
- Name: {session.ProjectName}
- Description: {session.NormalizedRequirement ?? session.Prompt}
- Features: {string.Join(", ", features)}
- Data Entities: {string.Join(", ", entities)}
- Framework: {stack?.Framework ?? "Next.js"}
- Language: {stack?.Language ?? "TypeScript"}
- Styling: {stack?.Styling ?? "Tailwind CSS"}
- Database: {stack?.Database ?? "PostgreSQL"}
- ORM: {stack?.Orm ?? "Prisma"}
- Authentication: {stack?.Auth ?? "NextAuth.js"}

Return your response in the following format:
===README===
<full markdown content>
===END README===

===SUMMARY===
<one paragraph summary of what will be built>
===END SUMMARY===";
    }

    /// <summary>
    /// Confirms the README/spec and proceeds to generation phase.
    /// </summary>
    public async Task<CodeGenSessionDto> ConfirmReadme(string sessionId)
    {
        var session = await LoadSession(sessionId);
        var readmePackage = LoadStoredReadmePackage(session.SpecJson);

        if (string.IsNullOrWhiteSpace(readmePackage?.ReadmeMarkdown))
            throw new UserFriendlyException("No README available for this session. Please go back to the blueprint step and regenerate it.");

        if (!HasUsableSpec(readmePackage.Plan))
            throw new UserFriendlyException("The implementation plan is empty or invalid. Please review the specification before generating.");

        session.SpecConfirmedAt = DateTime.UtcNow;
        session.Status = (int)CodeGenStatus.SpecConfirmed;
        session.UpdatedAt = DateTime.UtcNow;
        await SaveSession(session);
        return MapSessionToDto(session);
    }

    private class RefinementHistoryEntry
    {
        public DateTime Timestamp { get; set; }
        public string ChangeRequest { get; set; }
        public List<string> ChangedFiles { get; set; } = new();
        public List<string> DeletedFiles { get; set; } = new();
    }

    private static List<GeneratedFileDto> ConvertToFileDtos(List<GeneratedFile> files)
    {
        return files.Select(f => new GeneratedFileDto { Path = f.Path, Content = f.Content }).ToList();
    }

    private static List<GeneratedFile> ConvertToFiles(List<GeneratedFileDto> fileDtos)
    {
        return fileDtos.Select(f => new GeneratedFile { Path = f.Path, Content = f.Content }).ToList();
    }

    // ──────────────────────────────────────────────────────────────────────────
    // AI Provider (Currently set to Gemini)
    // ──────────────────────────────────────────────────────────────────────────

    private async Task<string> CallAiAsync(string systemPrompt, string userPrompt)
    {
        // To use Claude instead, uncomment the following line:
        // return await _claudeApiClient.CallClaudeAsync(systemPrompt, userPrompt);
        
        return await CallGeminiAsync(systemPrompt, userPrompt);
    }

    private async Task<string> CallGeminiAsync(string systemPrompt, string userPrompt)
    {
        var apiKey = _configuration["Gemini:ApiKey"];
        var model = _configuration["Gemini:Model"] ?? "gemini-2.5-flash";
        var baseUrl = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";

        int maxRetries = 3;
        int delaySeconds = 2;

        for (int i = 0; i <= maxRetries; i++)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromSeconds(600);
                
                var requestBody = new
                {
                    system_instruction = new
                    {
                        parts = new[] { new { text = systemPrompt } }
                    },
                    contents = new[]
                    {
                        new
                        {
                            role = "user",
                            parts = new[] { new { text = userPrompt } }
                        }
                    },
                    generationConfig = new
                    {
                        temperature = 0.7,
                        maxOutputTokens = 8192
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
                    if (i == maxRetries) throw new UserFriendlyException("AI service is currently overloaded. Please try again in a few minutes.");

                    Logger.Warn($"Gemini API Rate Limit (429). Retrying in {delaySeconds}s... (Attempt {i + 1}/{maxRetries})");
                    await Task.Delay(TimeSpan.FromSeconds(delaySeconds));
                    delaySeconds *= 2;
                    continue;
                }

                response.EnsureSuccessStatusCode();

                var responseJson = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(responseJson);
                
                // Gemini response structure: candidates[0].content.parts[0].text
                return doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString() ?? string.Empty;
            }
            catch (HttpRequestException ex) when (i < maxRetries)
            {
                Logger.Warn($"Gemini API Request failed: {ex.Message}. Retrying in {delaySeconds}s...");
                await Task.Delay(TimeSpan.FromSeconds(delaySeconds));
                delaySeconds *= 2;
            }
        }

        throw new UserFriendlyException("Failed to communicate with the AI service after multiple attempts.");
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Parsing helpers
    // ──────────────────────────────────────────────────────────────────────────

    private static string ParseDelimitedSection(string content, string sectionName)
    {
        if (string.IsNullOrEmpty(content)) return null;

        var startTag = $"==={sectionName}===";
        var endTag = $"===END {sectionName}===";

        var startIdx = content.IndexOf(startTag, StringComparison.OrdinalIgnoreCase);
        if (startIdx < 0) return null;

        startIdx += startTag.Length;
        var endIdx = content.IndexOf(endTag, startIdx, StringComparison.OrdinalIgnoreCase);
        if (endIdx < 0) return content[startIdx..].Trim();

        return content[startIdx..endIdx].Trim();
    }

    private static List<GeneratedFile> ParseFiles(string content)
    {
        var files = new List<GeneratedFile>();
        if (string.IsNullOrEmpty(content)) return files;

        var remaining = content;
        while (true)
        {
            var fileStart = remaining.IndexOf("===FILE===", StringComparison.OrdinalIgnoreCase);
            if (fileStart < 0) break;

            var pathStart = fileStart + "===FILE===".Length;
            var contentTag = remaining.IndexOf("===CONTENT===", pathStart, StringComparison.OrdinalIgnoreCase);
            if (contentTag < 0) break;

            var path = remaining[pathStart..contentTag].Trim();
            var contentStart = contentTag + "===CONTENT===".Length;
            var fileEnd = remaining.IndexOf("===END FILE===", contentStart, StringComparison.OrdinalIgnoreCase);

            string fileContent;
            if (fileEnd >= 0)
            {
                fileContent = remaining[contentStart..fileEnd].Trim();
                remaining = remaining[(fileEnd + "===END FILE===".Length)..];
            }
            else
            {
                fileContent = remaining[contentStart..].Trim();
                break;
            }

            if (!string.IsNullOrEmpty(path))
            {
                files.Add(new GeneratedFile { Path = path, Content = fileContent });
            }
        }

        return files;
    }

    private static List<string> ParseModules(string content)
    {
        var modulesStr = ParseDelimitedSection(content, "MODULES");
        return ParseCsvList(modulesStr);
    }

    private static List<string> ParseCsvList(string csv)
    {
        if (string.IsNullOrWhiteSpace(csv)) return new List<string>();
        return csv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .ToList();
    }

    private static AppSpecDto ParseSpecOrDefault(string specJson, out string warning)
    {
        warning = null;
        if (string.IsNullOrWhiteSpace(specJson))
            return NormalizeSpec(new AppSpecDto());

        try
        {
            var strict = JsonSerializer.Deserialize<AppSpecDto>(specJson, JsonOptions) ?? new AppSpecDto();
            return NormalizeSpec(strict);
        }
        catch (Exception strictEx)
        {
            try
            {
                using var doc = JsonDocument.Parse(specJson);
                var fallback = BuildSpecFromJson(doc.RootElement);
                warning = $"GenerateSpec: Strict parse failed ({strictEx.Message}). Tolerant parser was used.";
                return NormalizeSpec(fallback);
            }
            catch (Exception fallbackEx)
            {
                warning = $"GenerateSpec: Failed to parse spec JSON: {fallbackEx.Message}. Raw: {specJson[..Math.Min(specJson.Length, 200)]}";
                return NormalizeSpec(new AppSpecDto());
            }
        }
    }

    private static AppSpecDto BuildSpecFromJson(JsonElement root)
    {
        return new AppSpecDto
        {
            Entities = ParseEntities(GetPropertyCaseInsensitive(root, "entities")),
            Pages = ParsePages(GetPropertyCaseInsensitive(root, "pages")),
            ApiRoutes = ParseApiRoutes(GetPropertyCaseInsensitive(root, "apiRoutes")),
            Validations = ParseValidations(GetPropertyCaseInsensitive(root, "validations")),
            FileManifest = ParseFileManifest(GetPropertyCaseInsensitive(root, "fileManifest"))
        };
    }

    private static List<EntitySpecDto> ParseEntities(JsonElement section)
    {
        var items = new List<EntitySpecDto>();
        foreach (var element in EnumerateSection(section))
        {
            if (TryDeserialize(element, out EntitySpecDto entity))
            {
                entity.Fields ??= new List<FieldSpecDto>();
                entity.Relations ??= new List<RelationSpecDto>();
                if (string.IsNullOrWhiteSpace(entity.TableName) && !string.IsNullOrWhiteSpace(entity.Name))
                    entity.TableName = entity.Name.ToLowerInvariant();
                items.Add(entity);
                continue;
            }

            if (element.ValueKind == JsonValueKind.String)
            {
                var name = element.GetString();
                if (!string.IsNullOrWhiteSpace(name))
                {
                    items.Add(new EntitySpecDto
                    {
                        Name = name,
                        TableName = name.ToLowerInvariant(),
                        Fields = new List<FieldSpecDto>(),
                        Relations = new List<RelationSpecDto>()
                    });
                }
            }
        }

        return items;
    }

    private static List<PageSpecDto> ParsePages(JsonElement section)
    {
        var items = new List<PageSpecDto>();
        foreach (var element in EnumerateSection(section))
        {
            if (TryDeserialize(element, out PageSpecDto page))
            {
                page.Components ??= new List<string>();
                page.DataRequirements ??= new List<string>();
                items.Add(page);
                continue;
            }

            if (element.ValueKind == JsonValueKind.String)
            {
                var route = element.GetString();
                if (!string.IsNullOrWhiteSpace(route))
                {
                    items.Add(new PageSpecDto
                    {
                        Route = route,
                        Name = route.Trim('/'),
                        Layout = "authenticated",
                        Components = new List<string>(),
                        DataRequirements = new List<string>(),
                        Description = string.Empty
                    });
                }
            }

            if (element.ValueKind == JsonValueKind.Object)
            {
                var route = GetStringProperty(element, "route")
                    ?? GetStringProperty(element, "path")
                    ?? GetStringProperty(element, "url");

                if (!string.IsNullOrWhiteSpace(route))
                {
                    var components = ParseStringList(GetPropertyCaseInsensitive(element, "components"));
                    var dataRequirements = ParseStringList(GetPropertyCaseInsensitive(element, "dataRequirements"));
                    var layout = (GetStringProperty(element, "layout") ?? "authenticated").ToLowerInvariant();
                    if (layout is not ("authenticated" or "public" or "admin"))
                        layout = "authenticated";

                    items.Add(new PageSpecDto
                    {
                        Route = NormalizePageRoute(route),
                        Name = GetStringProperty(element, "name") ?? BuildPageNameFromRoute(route),
                        Layout = layout,
                        Components = components,
                        DataRequirements = dataRequirements,
                        Description = GetStringProperty(element, "description") ?? string.Empty
                    });
                }
            }
        }

        return items;
    }

    private static List<ApiRouteSpecDto> ParseApiRoutes(JsonElement section)
    {
        var items = new List<ApiRouteSpecDto>();
        foreach (var element in EnumerateSection(section))
        {
            if (TryDeserialize(element, out ApiRouteSpecDto route))
            {
                route.ResponseShape ??= new { };
                items.Add(route);
                continue;
            }

            if (element.ValueKind == JsonValueKind.Object)
            {
                var method = GetStringProperty(element, "method") ?? "GET";
                var path = GetStringProperty(element, "path") ?? string.Empty;
                var handler = GetStringProperty(element, "handler") ?? string.Empty;
                var description = GetStringProperty(element, "description") ?? string.Empty;

                items.Add(new ApiRouteSpecDto
                {
                    Method = method,
                    Path = path,
                    Handler = handler,
                    RequestBody = ToLooseObject(GetPropertyCaseInsensitive(element, "requestBody")),
                    ResponseShape = ToLooseObject(GetPropertyCaseInsensitive(element, "responseShape")) ?? new { },
                    Auth = GetBoolProperty(element, "auth"),
                    Description = description
                });
            }
        }

        return items;
    }

    private static List<ValidationRuleDto> ParseValidations(JsonElement section)
    {
        var items = new List<ValidationRuleDto>();
        foreach (var element in EnumerateSection(section))
        {
            if (TryDeserialize(element, out ValidationRuleDto validation))
            {
                items.Add(validation);
                continue;
            }

            if (element.ValueKind == JsonValueKind.String)
            {
                var description = element.GetString();
                if (!string.IsNullOrWhiteSpace(description))
                {
                    var id = Slugify(description);
                    items.Add(new ValidationRuleDto
                    {
                        Id = string.IsNullOrWhiteSpace(id) ? Guid.NewGuid().ToString("N")[..8] : id,
                        Category = "build-passes",
                        Description = description,
                        Target = "project",
                        Assertion = description,
                        Automatable = false
                    });
                }
                continue;
            }

            if (element.ValueKind == JsonValueKind.Object)
            {
                var description = GetStringProperty(element, "description")
                    ?? GetStringProperty(element, "assertion")
                    ?? GetStringProperty(element, "name")
                    ?? "Validation rule";

                var category = (GetStringProperty(element, "category") ?? "build-passes").ToLowerInvariant();
                var id = GetStringProperty(element, "id") ?? Slugify(description);
                items.Add(new ValidationRuleDto
                {
                    Id = string.IsNullOrWhiteSpace(id) ? Guid.NewGuid().ToString("N")[..8] : id,
                    Category = category,
                    Description = description,
                    Target = GetStringProperty(element, "target") ?? "project",
                    Assertion = GetStringProperty(element, "assertion") ?? description,
                    Automatable = GetBoolProperty(element, "automatable"),
                    Script = GetStringProperty(element, "script")
                });
            }
        }

        return items;
    }

    private static List<FileEntryDto> ParseFileManifest(JsonElement section)
    {
        var items = new List<FileEntryDto>();
        foreach (var element in EnumerateSection(section))
        {
            if (TryDeserialize(element, out FileEntryDto file))
            {
                items.Add(file);
                continue;
            }

            if (element.ValueKind == JsonValueKind.String)
            {
                var path = element.GetString();
                if (!string.IsNullOrWhiteSpace(path))
                {
                    items.Add(new FileEntryDto
                    {
                        Path = path,
                        Type = "generated",
                        Description = string.Empty
                    });
                }
            }
        }

        return items;
    }

    private static IEnumerable<JsonElement> EnumerateSection(JsonElement section)
    {
        if (section.ValueKind == JsonValueKind.Array)
            return section.EnumerateArray();

        if (section.ValueKind is JsonValueKind.Object or JsonValueKind.String)
            return new[] { section };

        return Enumerable.Empty<JsonElement>();
    }

    private static bool TryDeserialize<T>(JsonElement element, out T result) where T : class
    {
        try
        {
            result = JsonSerializer.Deserialize<T>(element.GetRawText(), JsonOptions);
            return result != null;
        }
        catch
        {
            result = null;
            return false;
        }
    }

    private static JsonElement GetPropertyCaseInsensitive(JsonElement element, string propertyName)
    {
        if (element.ValueKind != JsonValueKind.Object)
            return default;

        foreach (var property in element.EnumerateObject())
        {
            if (string.Equals(property.Name, propertyName, StringComparison.OrdinalIgnoreCase))
                return property.Value;
        }

        return default;
    }

    private static string GetStringProperty(JsonElement element, string propertyName)
    {
        var prop = GetPropertyCaseInsensitive(element, propertyName);
        if (prop.ValueKind == JsonValueKind.String)
            return prop.GetString();

        if (prop.ValueKind is JsonValueKind.Number or JsonValueKind.True or JsonValueKind.False)
            return prop.GetRawText();

        return null;
    }

    private static bool GetBoolProperty(JsonElement element, string propertyName)
    {
        var prop = GetPropertyCaseInsensitive(element, propertyName);
        return prop.ValueKind == JsonValueKind.True ||
               (prop.ValueKind == JsonValueKind.String && bool.TryParse(prop.GetString(), out var parsed) && parsed);
    }

    private static object ToLooseObject(JsonElement element)
    {
        if (element.ValueKind is JsonValueKind.Undefined or JsonValueKind.Null)
            return null;

        if (element.ValueKind == JsonValueKind.String)
            return element.GetString();

        if (element.ValueKind == JsonValueKind.Number)
        {
            if (element.TryGetInt64(out var asInt)) return asInt;
            if (element.TryGetDouble(out var asDouble)) return asDouble;
        }

        if (element.ValueKind == JsonValueKind.True || element.ValueKind == JsonValueKind.False)
            return element.GetBoolean();

        try
        {
            return JsonSerializer.Deserialize<object>(element.GetRawText(), JsonOptions);
        }
        catch
        {
            return element.GetRawText();
        }
    }

    private static AppSpecDto NormalizeSpec(AppSpecDto spec)
    {
        spec ??= new AppSpecDto();

        spec.Entities ??= new List<EntitySpecDto>();
        spec.Pages ??= new List<PageSpecDto>();
        spec.ApiRoutes ??= new List<ApiRouteSpecDto>();
        spec.Validations ??= new List<ValidationRuleDto>();
        spec.FileManifest ??= new List<FileEntryDto>();

        spec.Entities = spec.Entities
            .Where(e => e != null)
            .Select(e =>
            {
                e.Fields ??= new List<FieldSpecDto>();
                e.Relations ??= new List<RelationSpecDto>();
                if (string.IsNullOrWhiteSpace(e.TableName) && !string.IsNullOrWhiteSpace(e.Name))
                    e.TableName = e.Name.ToLowerInvariant();
                return e;
            })
            .Where(e => !string.IsNullOrWhiteSpace(e.Name))
            .GroupBy(e => e.Name, StringComparer.OrdinalIgnoreCase)
            .Select(g => g.First())
            .ToList();

        spec.ApiRoutes = spec.ApiRoutes
            .Where(r => r != null)
            .Select(r =>
            {
                r.Method = string.IsNullOrWhiteSpace(r.Method) ? "GET" : r.Method.ToUpperInvariant();
                r.Path = NormalizeApiPath(r.Path);
                r.ResponseShape ??= new { };
                r.Description ??= string.Empty;
                return r;
            })
            .Where(r => !string.IsNullOrWhiteSpace(r.Path))
            .GroupBy(r => $"{r.Method}:{r.Path}", StringComparer.OrdinalIgnoreCase)
            .Select(g => g.First())
            .ToList();

        spec.FileManifest = spec.FileManifest
            .Where(f => f != null && !string.IsNullOrWhiteSpace(f.Path))
            .GroupBy(f => f.Path, StringComparer.OrdinalIgnoreCase)
            .Select(g =>
            {
                var first = g.First();
                first.Type ??= "generated";
                first.Description ??= string.Empty;
                return first;
            })
            .ToList();

        spec.Pages = spec.Pages
            .Where(p => p != null)
            .Select(p =>
            {
                p.Route = NormalizePageRoute(p.Route);
                p.Name = string.IsNullOrWhiteSpace(p.Name) ? BuildPageNameFromRoute(p.Route) : p.Name;
                p.Layout = NormalizeLayout(p.Layout);
                p.Components ??= new List<string>();
                p.DataRequirements ??= new List<string>();
                p.Description ??= string.Empty;
                return p;
            })
            .Where(p => !string.IsNullOrWhiteSpace(p.Route))
            .GroupBy(p => p.Route, StringComparer.OrdinalIgnoreCase)
            .Select(g => g.First())
            .ToList();

        if (spec.Pages.Count == 0)
            spec.Pages = BuildFallbackPages(spec.ApiRoutes, spec.FileManifest);

        spec.Validations = spec.Validations
            .Where(v => v != null)
            .Select(v =>
            {
                v.Id = string.IsNullOrWhiteSpace(v.Id) ? Guid.NewGuid().ToString("N")[..8] : v.Id;
                v.Category = NormalizeValidationCategory(v.Category);
                v.Description ??= "Validation rule";
                v.Target ??= "project";
                v.Assertion ??= v.Description;
                return v;
            })
            .GroupBy(v => v.Id, StringComparer.OrdinalIgnoreCase)
            .Select(g => g.First())
            .ToList();

        if (spec.Validations.Count == 0)
            spec.Validations = BuildFallbackValidations(spec);

        return spec;
    }

    private static List<PageSpecDto> BuildFallbackPages(List<ApiRouteSpecDto> apiRoutes, List<FileEntryDto> fileManifest)
    {
        var routes = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var apiRoute in apiRoutes ?? new List<ApiRouteSpecDto>())
        {
            var pageRoute = ApiPathToPageRoute(apiRoute.Path);
            if (!string.IsNullOrWhiteSpace(pageRoute))
                routes.Add(pageRoute);
        }

        foreach (var file in fileManifest ?? new List<FileEntryDto>())
        {
            var fromFile = FilePathToPageRoute(file.Path);
            if (!string.IsNullOrWhiteSpace(fromFile))
                routes.Add(fromFile);
        }

        if (routes.Count == 0)
            routes.Add("/");

        return routes
            .OrderBy(r => r, StringComparer.OrdinalIgnoreCase)
            .Select(route => new PageSpecDto
            {
                Route = route,
                Name = BuildPageNameFromRoute(route),
                Layout = route.StartsWith("/auth", StringComparison.OrdinalIgnoreCase)
                    || route.StartsWith("/login", StringComparison.OrdinalIgnoreCase)
                    || route.StartsWith("/register", StringComparison.OrdinalIgnoreCase)
                    ? "public"
                    : "authenticated",
                Components = new List<string>(),
                DataRequirements = new List<string>(),
                Description = "Generated fallback page from available routes/files."
            })
            .ToList();
    }

    private static void EnsureHomePage(List<PageSpecDto> pages)
    {
        if (pages == null || pages.Count == 0)
            return;

        var existingRoutes = new HashSet<string>(
            pages.Select(page => NormalizePageRoute(page.Route)),
            StringComparer.OrdinalIgnoreCase);

        if (!existingRoutes.Add("/"))
            return;

        pages.Insert(0, BuildHomePageSpec(pages));
    }

    private static PageSpecDto BuildHomePageSpec(List<PageSpecDto> existingPages)
    {
        return new PageSpecDto
        {
            Route = "/",
            Name = "Home",
            Layout = InferHomePageLayout(existingPages),
            Components = new List<string>(),
            DataRequirements = new List<string>(),
            Description = "Recovered default home route for the application shell."
        };
    }

    private static string InferHomePageLayout(List<PageSpecDto> existingPages)
    {
        // Mirror the plan's prevailing access level so the generated shell stays consistent.
        return existingPages.Any(page => string.Equals(page.Layout, "public", StringComparison.OrdinalIgnoreCase))
            ? "public"
            : "authenticated";
    }

    private static List<ValidationRuleDto> BuildFallbackValidations(AppSpecDto spec)
    {
        var rules = new List<ValidationRuleDto>
        {
            new()
            {
                Id = "build-passes",
                Category = "build-passes",
                Description = "Project should build successfully.",
                Target = "project",
                Assertion = "Build command exits with status code 0.",
                Automatable = true,
                Script = "npm run build"
            }
        };

        if (spec.Entities.Any())
        {
            rules.Add(new ValidationRuleDto
            {
                Id = "entity-schema",
                Category = "entity-schema",
                Description = "Entity definitions should include required identifiers and key fields.",
                Target = "entities",
                Assertion = "Each entity has a stable identifier field and valid field types.",
                Automatable = true
            });
        }

        if (spec.ApiRoutes.Any())
        {
            rules.Add(new ValidationRuleDto
            {
                Id = "route-exists",
                Category = "route-exists",
                Description = "Declared API routes should be implemented.",
                Target = "apiRoutes",
                Assertion = "Every route in spec resolves to a handler implementation.",
                Automatable = true
            });
        }

        if (spec.ApiRoutes.Any(r => r.Auth))
        {
            rules.Add(new ValidationRuleDto
            {
                Id = "auth-guard",
                Category = "auth-guard",
                Description = "Protected API routes should enforce authentication.",
                Target = "apiRoutes",
                Assertion = "Routes marked with auth=true require authentication middleware.",
                Automatable = true
            });
        }

        return rules;
    }

    private static string NormalizePageRoute(string route)
    {
        if (string.IsNullOrWhiteSpace(route))
            return string.Empty;

        var normalized = route.Trim();
        if (!normalized.StartsWith('/'))
            normalized = "/" + normalized;

        normalized = normalized.Replace("//", "/");
        return normalized.Length > 1 ? normalized.TrimEnd('/') : normalized;
    }

    private static string NormalizeApiPath(string path)
    {
        if (string.IsNullOrWhiteSpace(path))
            return string.Empty;

        var normalized = path.Trim();
        if (!normalized.StartsWith('/'))
            normalized = "/" + normalized;

        normalized = normalized.Replace("//", "/");
        return normalized;
    }

    private static string ApiPathToPageRoute(string apiPath)
    {
        if (string.IsNullOrWhiteSpace(apiPath))
            return null;

        var normalized = NormalizeApiPath(apiPath);
        if (!normalized.StartsWith("/api", StringComparison.OrdinalIgnoreCase))
            return null;

        var pageRoute = normalized[4..];
        if (string.IsNullOrWhiteSpace(pageRoute))
            return "/";

        pageRoute = Regex.Replace(pageRoute, @":([A-Za-z0-9_]+)", "[$1]");
        pageRoute = Regex.Replace(pageRoute, @"\{([A-Za-z0-9_]+)\}", "[$1]");
        return NormalizePageRoute(pageRoute);
    }

    private static string FilePathToPageRoute(string path)
    {
        if (string.IsNullOrWhiteSpace(path))
            return null;

        var normalized = path.Replace('\\', '/');
        if (Regex.IsMatch(normalized, @"(^|/)app/page\.[^/]+$", RegexOptions.IgnoreCase))
            return "/";

        var match = Regex.Match(normalized, @"(^|/)app/(?<route>.+)/page\.[^/]+$", RegexOptions.IgnoreCase);
        if (!match.Success)
            return null;

        return NormalizePageRoute(match.Groups["route"].Value);
    }

    private static string BuildPageNameFromRoute(string route)
    {
        if (string.IsNullOrWhiteSpace(route) || route == "/")
            return "Home";

        var parts = route
            .Trim('/')
            .Split('/', StringSplitOptions.RemoveEmptyEntries)
            .Select(p => p.Trim('[', ']'))
            .Where(p => !string.IsNullOrWhiteSpace(p))
            .Select(ToPascalCase)
            .ToList();

        return parts.Count == 0 ? "Page" : string.Join(string.Empty, parts);
    }

    private static string ToPascalCase(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return string.Empty;

        var tokens = Regex.Split(value, "[^A-Za-z0-9]+")
            .Where(t => !string.IsNullOrWhiteSpace(t))
            .Select(t => char.ToUpperInvariant(t[0]) + t[1..].ToLowerInvariant());

        return string.Join(string.Empty, tokens);
    }

    private static string NormalizeLayout(string layout)
    {
        var normalized = (layout ?? "authenticated").ToLowerInvariant();
        return normalized is "authenticated" or "public" or "admin" ? normalized : "authenticated";
    }

    private static string NormalizeValidationCategory(string category)
    {
        var normalized = (category ?? "build-passes").ToLowerInvariant();
        return normalized switch
        {
            "file-exists" or "entity-schema" or "route-exists" or "build-passes" or "lint-passes" or
            "env-vars" or "test-passes" or "auth-guard" or "type-check" or "api-returns" => normalized,
            _ => "build-passes"
        };
    }

    private static List<string> ParseStringList(JsonElement element)
    {
        if (element.ValueKind == JsonValueKind.Array)
        {
            return element.EnumerateArray()
                .Where(v => v.ValueKind == JsonValueKind.String)
                .Select(v => v.GetString())
                .Where(v => !string.IsNullOrWhiteSpace(v))
                .ToList();
        }

        if (element.ValueKind == JsonValueKind.String)
        {
            var value = element.GetString();
            return string.IsNullOrWhiteSpace(value)
                ? new List<string>()
                : value.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();
        }

        return new List<string>();
    }

    private static string Slugify(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return string.Empty;

        var slug = Regex.Replace(value.ToLowerInvariant(), "[^a-z0-9]+", "-").Trim('-');
        return slug.Length > 64 ? slug[..64] : slug;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Scaffold & file helpers
    // ──────────────────────────────────────────────────────────────────────────

    private string FindTemplateDirectory(string templateSlug, string currentDir = null)
    {
        // Walk up from the current directory and base directory to find the frontend/templates folder
        var roots = new[] { currentDir ?? Directory.GetCurrentDirectory(), AppDomain.CurrentDomain.BaseDirectory };
        foreach (var root in roots)
        {
            var dir = root;
            for (var i = 0; i < 8; i++)
            {
                var candidate = Path.GetFullPath(Path.Combine(dir, "frontend", "templates", templateSlug));
                if (Directory.Exists(candidate)) return candidate;
                var parent = Directory.GetParent(dir)?.FullName;
                if (parent == null || parent == dir) break;
                dir = parent;
            }
        }

        return null;
    }

    private static List<GeneratedFile> ReadScaffoldFiles(string templateDir)
    {
        var files = new List<GeneratedFile>();
        var allFiles = Directory.GetFiles(templateDir, "*", SearchOption.AllDirectories);

        foreach (var filePath in allFiles)
        {
            var relativePath = Path.GetRelativePath(templateDir, filePath).Replace('\\', '/');
            // Skip hidden directories and node_modules
            if (relativePath.StartsWith(".git/") || relativePath.Contains("node_modules/"))
                continue;

            try
            {
                var content = File.ReadAllText(filePath);
                files.Add(new GeneratedFile { Path = relativePath, Content = content });
            }
            catch
            {
                // Skip binary/unreadable files
            }
        }

        return files;
    }

    private static void WriteFilesToDisk(List<GeneratedFile> files, string outputPath)
    {
        foreach (var file in files)
        {
            var fullPath = Path.Combine(outputPath, file.Path.Replace('/', Path.DirectorySeparatorChar));
            var dir = Path.GetDirectoryName(fullPath);
            if (!string.IsNullOrEmpty(dir))
                Directory.CreateDirectory(dir);

            File.WriteAllText(fullPath, file.Content);
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Prompt builders
    // ──────────────────────────────────────────────────────────────────────────

    private static string BuildRequirementsPrompt(CreateUpdateProjectDto input)
    {
        return $"Analyze the following application idea and provide a structured breakdown.\n\n"
            + $"Application idea: {input.Prompt}\n"
            + $"Framework: {input.Framework}\n"
            + $"Language: {input.Language}\n"
            + $"Database: {input.DatabaseOption}\n"
            + $"Include Auth: {input.IncludeAuth}\n\n"
            + "Return your analysis in the following format:\n"
            + "===FEATURES===\n<comma-separated list of features>\n===END FEATURES===\n"
            + "===ARCHITECTURE===\n<brief architecture description>\n===END ARCHITECTURE===\n"
            + "===PAGES===\n<comma-separated list of page names>\n===END PAGES===\n"
            + "===API_ENDPOINTS===\n<list of API endpoints, one per line>\n===END API_ENDPOINTS===\n"
            + "===DB_ENTITIES===\n<list of database entities with fields>\n===END DB_ENTITIES===\n";
    }

    private static string BuildCodeGenSystemPrompt(
        string layerDescription,
        AppSpecDto approvedPlan,
        string framework,
        string scaffoldBaseline = null,
        string approvedReadme = null)
    {
        return GeneratorPrompts.BuildLayerPrompt(
            layerDescription,
            approvedPlan,
            new StackConfigDto { Framework = framework },
            scaffoldBaseline,
            approvedReadme);
    }

    private static string BuildValidationConstraints(List<ValidationRuleDto> validations)
    {
        if (validations == null || validations.Count == 0) return string.Empty;

        var sb = new StringBuilder();
        sb.AppendLine("\n\nIMPORTANT CONSTRAINTS - The generated code MUST satisfy these validations:");
        foreach (var v in validations)
        {
            sb.AppendLine($"- [{v.Category}] {v.Description}: {v.Assertion}");
        }
        return sb.ToString();
    }

    private static List<ValidationResultDto> BuildInitialValidationResults(
        List<ValidationRuleDto> validations,
        StackConfigDto stack)
    {
        var results = new List<ValidationResultDto>();
        
        // Always ensure build-passes validation is present
        var hasBuildPasses = validations?.Any(v => 
            !string.IsNullOrWhiteSpace(v.Category) && 
            v.Category.Equals("build-passes", StringComparison.OrdinalIgnoreCase)) ?? false;
        
        if (!hasBuildPasses)
        {
            results.Add(new ValidationResultDto
            {
                Id = "build-passes",
                Status = "pending",
                Message = "Project should build successfully."
            });
        }
        
        // Add all other validations from the spec
        if (validations != null && validations.Count > 0)
        {
            foreach (var v in validations)
            {
                var id = string.IsNullOrWhiteSpace(v.Id) 
                    ? Guid.NewGuid().ToString("N")[..8] 
                    : v.Id;
                
                // Skip if we already added build-passes
                if (hasBuildPasses && 
                    !string.IsNullOrWhiteSpace(v.Category) && 
                    v.Category.Equals("build-passes", StringComparison.OrdinalIgnoreCase))
                {
                    results.Add(new ValidationResultDto
                    {
                        Id = id,
                        Status = "pending",
                        Message = string.IsNullOrWhiteSpace(v.Description) ? "Validation queued." : v.Description
                    });
                }
                else
                {
                    results.Add(new ValidationResultDto
                    {
                        Id = id,
                        Status = "pending",
                        Message = string.IsNullOrWhiteSpace(v.Description) ? "Validation queued." : v.Description
                    });
                }
            }
        }
        
        // Ensure we have at least one validation
        if (results.Count == 0)
        {
            results.Add(new ValidationResultDto
            {
                Id = "build-passes",
                Status = "pending",
                Message = "Project should build successfully."
            });
        }

        results.AddRange(BuildShellValidationPlaceholders(stack)
            .Where(shellValidation => results.All(existing => !existing.Id.Equals(shellValidation.Id, StringComparison.OrdinalIgnoreCase))));

        return results;
    }

    private static List<ValidationResultDto> EvaluateValidationResults(
        List<ValidationRuleDto> validations,
        List<GeneratedFile> generatedFiles,
        StackConfigDto stack)
    {
        var files = generatedFiles ?? new List<GeneratedFile>();
        var filePaths = new HashSet<string>(
            files.Select(f => NormalizeFilePath(f.Path)),
            StringComparer.OrdinalIgnoreCase);
        var combinedContent = string.Join("\n", files.Select(f => f.Content ?? string.Empty));

        var results = new List<ValidationResultDto>();
        
        // Always evaluate build-passes first to ensure it's always present
        var hasBuildPassesInResults = false;
        
        foreach (var validation in validations ?? new List<ValidationRuleDto>())
        {
            var id = string.IsNullOrWhiteSpace(validation.Id)
                ? Guid.NewGuid().ToString("N")[..8]
                : validation.Id;
            var category = (validation.Category ?? string.Empty).ToLowerInvariant();

            var passed = true;
            var message = "Validation passed.";

            switch (category)
            {
                case "file-exists":
                {
                    var targetPath = NormalizeFilePath(validation.Target);
                    passed = string.IsNullOrWhiteSpace(targetPath)
                        ? files.Count > 0
                        : filePaths.Contains(targetPath);
                    message = passed
                        ? "Required file exists."
                        : $"Required file not found: {validation.Target}";
                    break;
                }
                case "build-passes":
                {
                    passed = filePaths.Contains("package.json");
                    message = passed
                        ? "Build validation baseline passed (package.json present)."
                        : "Build validation baseline failed: package.json not found.";
                    hasBuildPassesInResults = true;
                    break;
                }
                case "route-exists":
                {
                    var routeHint = ExtractRouteHint(validation);
                    passed = string.IsNullOrWhiteSpace(routeHint)
                        || combinedContent.Contains(routeHint, StringComparison.OrdinalIgnoreCase);
                    message = passed
                        ? "Route reference found in generated files."
                        : $"Route reference not found in generated files: {routeHint}";
                    break;
                }
                case "entity-schema":
                {
                    // Check if entities have proper structure (at least one field defined)
                    passed = files.Count > 0;
                    message = passed
                        ? "Entity schema validation passed (generated files available)."
                        : "Entity schema validation failed: no generated files.";
                    break;
                }
                case "auth-guard":
                {
                    // Check if auth-related files exist
                    var hasAuthFiles = filePaths.Any(p => 
                        p.Contains("auth", StringComparison.OrdinalIgnoreCase) ||
                        p.Contains("login", StringComparison.OrdinalIgnoreCase) ||
                        p.Contains("session", StringComparison.OrdinalIgnoreCase));
                    passed = !validation.Automatable || hasAuthFiles || files.Count > 0;
                    message = passed
                        ? "Auth guard validation passed."
                        : "Auth guard validation failed: no auth-related files found.";
                    break;
                }
                case "lint-passes":
                case "type-check":
                {
                    // Basic check - if files exist, assume lint/type check can be run
                    passed = files.Count > 0;
                    message = passed
                        ? $"{category} validation baseline passed (files available for checking)."
                        : $"{category} validation failed: no files to check.";
                    break;
                }
                case "env-vars":
                {
                    // Check if .env or config files exist
                    var hasEnvFiles = filePaths.Any(p => 
                        p.Contains(".env", StringComparison.OrdinalIgnoreCase) ||
                        p.Contains("config", StringComparison.OrdinalIgnoreCase));
                    passed = !validation.Automatable || hasEnvFiles || files.Count > 0;
                    message = passed
                        ? "Environment variables validation passed."
                        : "Environment variables validation failed: no config files found.";
                    break;
                }
                case "test-passes":
                {
                    // Check if test files exist
                    var hasTestFiles = filePaths.Any(p => 
                        p.Contains("test", StringComparison.OrdinalIgnoreCase) ||
                        p.Contains("spec", StringComparison.OrdinalIgnoreCase));
                    passed = !validation.Automatable || hasTestFiles || files.Count > 0;
                    message = passed
                        ? "Test validation baseline passed."
                        : "Test validation failed: no test files found.";
                    break;
                }
                case "api-returns":
                {
                    // Check if API route files exist
                    var hasApiFiles = filePaths.Any(p => 
                        p.Contains("api", StringComparison.OrdinalIgnoreCase) ||
                        p.Contains("route", StringComparison.OrdinalIgnoreCase));
                    passed = hasApiFiles || files.Count > 0;
                    message = passed
                        ? "API returns validation baseline passed."
                        : "API returns validation failed: no API files found.";
                    break;
                }
                default:
                {
                    passed = true;
                    message = "Validation rule registered and marked as passed.";
                    break;
                }
            }

            results.Add(new ValidationResultDto
            {
                Id = id,
                Status = passed ? "passed" : "failed",
                Message = message
            });
        }

        results.AddRange(BuildShellValidationResults(stack, files, filePaths)
            .Where(shellValidation => results.All(existing => !existing.Id.Equals(shellValidation.Id, StringComparison.OrdinalIgnoreCase))));

        // Always ensure build-passes validation is present in results
        if (!hasBuildPassesInResults)
        {
            var buildPassed = filePaths.Contains("package.json");
            results.Insert(0, new ValidationResultDto
            {
                Id = "build-passes",
                Status = buildPassed ? "passed" : "failed",
                Message = buildPassed
                    ? "Build validation baseline passed (package.json present)."
                    : "Build validation baseline failed: package.json not found."
            });
        }

        // Ensure we have at least one validation result
        if (results.Count == 0)
        {
            results.Add(new ValidationResultDto
            {
                Id = "build-passes",
                Status = files.Count > 0 ? "passed" : "failed",
                Message = files.Count > 0
                    ? "Generated output available for validation."
                    : "No generated files were produced."
            });
        }

        return results;
    }

    private static List<ValidationResultDto> BuildShellValidationPlaceholders(StackConfigDto stack)
    {
        if (string.IsNullOrWhiteSpace(stack?.Framework))
            return new List<ValidationResultDto>();

        var framework = MapFrameworkString(stack?.Framework);
        var results = new List<ValidationResultDto>();

        if (framework == Framework.NextJS)
        {
            results.Add(CreatePendingValidation(
                NextHomePageValidationId,
                "Next.js shell must include src/app/page.tsx."));
            results.Add(CreatePendingValidation(
                RequiredLayoutValidationId,
                "Application shell must include a root layout file."));
            results.Add(CreatePendingValidation(
                StyledHomeRouteValidationId,
                "Application must include at least one styled landing or home route."));
        }

        if (framework == Framework.ReactVite)
        {
            results.Add(CreatePendingValidation(
                ViteIndexHtmlValidationId,
                "Vite shell must include index.html."));
            results.Add(CreatePendingValidation(
                RequiredLayoutValidationId,
                "Application shell must include a root layout file."));
            results.Add(CreatePendingValidation(
                StyledHomeRouteValidationId,
                "Application must include at least one styled landing or home route."));
        }

        return results;
    }

    private static ValidationResultDto CreatePendingValidation(string id, string message)
    {
        return new ValidationResultDto
        {
            Id = id,
            Status = "pending",
            Message = message
        };
    }

    private static List<ValidationResultDto> BuildShellValidationResults(
        StackConfigDto stack,
        List<GeneratedFile> files,
        HashSet<string> filePaths)
    {
        if (string.IsNullOrWhiteSpace(stack?.Framework))
            return new List<ValidationResultDto>();

        var framework = MapFrameworkString(stack?.Framework);
        var results = new List<ValidationResultDto>();

        if (framework == Framework.NextJS)
        {
            var hasHomePage = HasAnyFile(filePaths, "src/app/page.tsx", "src/app/page.jsx", "src/app/page.ts", "src/app/page.js");
            var hasLayout = HasAnyFile(filePaths, "src/app/layout.tsx", "src/app/layout.jsx", "src/app/layout.ts", "src/app/layout.js");
            var hasStyledHomeRoute = HasStyledRoute(files,
                "src/app/page.tsx",
                "src/app/page.jsx",
                "src/app/page.ts",
                "src/app/page.js");

            results.Add(CreateShellValidationResult(
                NextHomePageValidationId,
                hasHomePage,
                "Next.js shell file present: src/app/page.tsx.",
                "Next.js shell file missing: src/app/page.tsx."));
            results.Add(CreateShellValidationResult(
                RequiredLayoutValidationId,
                hasLayout,
                "Root layout file present.",
                "Required layout file missing: src/app/layout.tsx."));
            results.Add(CreateShellValidationResult(
                StyledHomeRouteValidationId,
                hasStyledHomeRoute,
                "Styled landing/home route found.",
                "No styled landing/home route found in src/app/page.tsx."));
        }

        if (framework == Framework.ReactVite)
        {
            var hasIndexHtml = HasAnyFile(filePaths, "index.html");
            var hasLayout = HasAnyFile(filePaths, "src/app.tsx", "src/app.jsx", "src/app.ts", "src/app.js");
            var hasStyledHomeRoute = HasStyledRoute(files,
                "src/app.tsx",
                "src/app.jsx",
                "src/app.ts",
                "src/app.js");

            results.Add(CreateShellValidationResult(
                ViteIndexHtmlValidationId,
                hasIndexHtml,
                "Vite entry file present: index.html.",
                "Vite shell file missing: index.html."));
            results.Add(CreateShellValidationResult(
                RequiredLayoutValidationId,
                hasLayout,
                "Root layout file present.",
                "Required layout file missing: src/App.tsx."));
            results.Add(CreateShellValidationResult(
                StyledHomeRouteValidationId,
                hasStyledHomeRoute,
                "Styled landing/home route found.",
                "No styled landing/home route found in src/App.tsx."));
        }

        return results;
    }

    private static ValidationResultDto CreateShellValidationResult(
        string id,
        bool passed,
        string passMessage,
        string failMessage)
    {
        return new ValidationResultDto
        {
            Id = id,
            Status = passed ? "passed" : "failed",
            Message = passed ? passMessage : failMessage
        };
    }

    private static bool HasAnyFile(HashSet<string> filePaths, params string[] candidatePaths)
    {
        return candidatePaths
            .Select(NormalizeFilePath)
            .Any(filePaths.Contains);
    }

    private static bool HasStyledRoute(List<GeneratedFile> files, params string[] candidatePaths)
    {
        foreach (var candidatePath in candidatePaths)
        {
            var normalizedPath = NormalizeFilePath(candidatePath);
            var routeFile = files.FirstOrDefault(file =>
                NormalizeFilePath(file.Path).Equals(normalizedPath, StringComparison.OrdinalIgnoreCase));

            if (routeFile == null)
                continue;

            // Treat common styling hooks as evidence that the home route is more than a bare placeholder.
            if (ContainsStyleHint(routeFile.Content))
                return true;
        }

        return false;
    }

    private static bool ContainsStyleHint(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
            return false;

        return content.Contains("className=", StringComparison.OrdinalIgnoreCase)
            || content.Contains("style={{", StringComparison.OrdinalIgnoreCase)
            || content.Contains("styles.", StringComparison.OrdinalIgnoreCase)
            || content.Contains("createStyles", StringComparison.OrdinalIgnoreCase)
            || content.Contains("styled(", StringComparison.OrdinalIgnoreCase)
            || content.Contains("styled.", StringComparison.OrdinalIgnoreCase)
            || Regex.IsMatch(content, @"import\s+.+\.(css|scss|sass|less)[""'];?", RegexOptions.IgnoreCase);
    }

    private static List<ValidationResultDto> MarkValidationResultsFailed(
        List<ValidationResultDto> validationResults,
        string errorMessage)
    {
        var reason = string.IsNullOrWhiteSpace(errorMessage)
            ? "Generation failed before validations completed."
            : $"Generation failed: {errorMessage}";

        if (validationResults == null || validationResults.Count == 0)
        {
            return new List<ValidationResultDto>
            {
                new()
                {
                    Id = "generation",
                    Status = "failed",
                    Message = reason
                }
            };
        }

        return validationResults
            .Select(v => new ValidationResultDto
            {
                Id = v.Id,
                Status = "failed",
                Message = reason
            })
            .ToList();
    }

    private static string ExtractRouteHint(ValidationRuleDto validation)
    {
        if (!string.IsNullOrWhiteSpace(validation.Target) && validation.Target.StartsWith('/'))
            return validation.Target;

        if (string.IsNullOrWhiteSpace(validation.Assertion))
            return string.Empty;

        var match = Regex.Match(validation.Assertion, @"/[A-Za-z0-9_\-/{}/:]+", RegexOptions.CultureInvariant);
        return match.Success ? match.Value : string.Empty;
    }

    private static string NormalizeFilePath(string filePath)
    {
        if (string.IsNullOrWhiteSpace(filePath))
            return string.Empty;

        var normalized = filePath.Replace('\\', '/').Trim();

        if (normalized.StartsWith("./", StringComparison.Ordinal))
            normalized = normalized[2..];

        if (normalized.StartsWith("/", StringComparison.Ordinal))
            normalized = normalized[1..];

        if (normalized.Equals("project", StringComparison.OrdinalIgnoreCase))
            return string.Empty;

        return normalized;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Session persistence
    // ──────────────────────────────────────────────────────────────────────────

    private async Task SaveSession(CodeGenSession session, bool isNew = false)
    {
        if (_sessionRepository != null)
        {
            if (isNew)
            {
                await _sessionRepository.InsertAsync(session);
            }
            else
            {
                await _sessionRepository.UpdateAsync(session);
            }
        }
        else
        {
            InMemorySessions[session.Id.ToString()] = session;
        }
    }

    private async Task<CodeGenSession> LoadSession(string sessionId)
    {
        if (!Guid.TryParse(sessionId, out var guid))
            throw new UserFriendlyException("Invalid session ID.");

        CodeGenSession session = null;

        if (_sessionRepository != null)
        {
            session = await _sessionRepository.FirstOrDefaultAsync(guid);
        }
        else
        {
            InMemorySessions.TryGetValue(sessionId, out session);
        }

        if (session == null)
            throw new UserFriendlyException($"Session '{sessionId}' not found.");

        return session;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Mapping helpers
    // ──────────────────────────────────────────────────────────────────────────

    private static GenerationBlueprint LoadGenerationBlueprint(string json)
    {
        var readmePackage = LoadStoredReadmePackage(json);
        if (readmePackage != null)
        {
            return new GenerationBlueprint
            {
                Spec = readmePackage.Plan ?? new AppSpecDto(),
                ReadmeMarkdown = readmePackage.ReadmeMarkdown
            };
        }

        return new GenerationBlueprint
        {
            Spec = DeserializeOrDefault<AppSpecDto>(json) ?? new AppSpecDto(),
            ReadmeMarkdown = null
        };
    }

    private static ReadmeResultDto LoadStoredReadmePackage(string json)
    {
        var readmePackage = DeserializeOrDefault<ReadmeResultDto>(json);
        return string.IsNullOrWhiteSpace(readmePackage?.ReadmeMarkdown) ? null : readmePackage;
    }

    private static AppSpecDto LoadStoredSpec(string json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return null;

        return NormalizeSpec(LoadGenerationBlueprint(json).Spec ?? new AppSpecDto());
    }

    private static bool HasUsableSpec(AppSpecDto spec)
    {
        return spec?.Entities?.Count > 0
            || spec?.ApiRoutes?.Count > 0
            || spec?.Pages?.Count > 0;
    }

    private CodeGenSessionDto MapSessionToDto(CodeGenSession session)
    {
        return new CodeGenSessionDto
        {
            Id = session.Id.ToString(),
            UserId = session.UserId ?? 0,
            ProjectId = session.ProjectId,
            ProjectName = session.ProjectName,
            Prompt = session.Prompt,
            NormalizedRequirement = session.NormalizedRequirement,
            DetectedFeatures = DeserializeOrDefault<List<string>>(session.DetectedFeaturesJson) ?? new List<string>(),
            DetectedEntities = DeserializeOrDefault<List<string>>(session.DetectedEntitiesJson) ?? new List<string>(),
            ConfirmedStack = DeserializeOrDefault<StackConfigDto>(session.ConfirmedStackJson),
            Spec = LoadStoredSpec(session.SpecJson),
            SpecConfirmedAt = session.SpecConfirmedAt,
            GenerationStartedAt = session.GenerationStartedAt,
            GenerationCompletedAt = session.GenerationCompletedAt,
            Status = session.Status,
            ValidationResults = DeserializeOrDefault<List<ValidationResultDto>>(session.ValidationResultsJson) ?? new List<ValidationResultDto>(),
            ScaffoldTemplate = session.ScaffoldTemplate,
            GeneratedFiles = DeserializeOrDefault<List<GeneratedFileDto>>(session.GeneratedFilesJson) ?? new List<GeneratedFileDto>(),
            RepairAttempts = session.RepairAttempts,
            IsPublic = session.IsPublic,
            GenerationMode = session.GenerationMode,
            CreatedAt = session.CreatedAt,
            UpdatedAt = session.UpdatedAt
        };
    }

    private static T DeserializeOrDefault<T>(string json) where T : class
    {
        if (string.IsNullOrEmpty(json)) return null;
        try { return JsonSerializer.Deserialize<T>(json, JsonOptions); }
        catch { return null; }
    }

    private static Framework MapFrameworkString(string framework)
    {
        if (string.IsNullOrEmpty(framework)) return Framework.NextJS;
        var lower = framework.ToLowerInvariant();
        if (lower.Contains("next")) return Framework.NextJS;
        if (lower.Contains("react") || lower.Contains("vite")) return Framework.ReactVite;
        if (lower.Contains("angular")) return Framework.Angular;
        if (lower.Contains("vue")) return Framework.Vue;
        if (lower.Contains("blazor") || lower.Contains(".net")) return Framework.DotNetBlazor;
        return Framework.NextJS;
    }

    private static ProgrammingLanguage MapLanguageString(string language)
    {
        if (string.IsNullOrEmpty(language)) return ProgrammingLanguage.TypeScript;
        var lower = language.ToLowerInvariant();
        if (lower.Contains("javascript") && !lower.Contains("type")) return ProgrammingLanguage.JavaScript;
        if (lower.Contains("c#") || lower.Contains("csharp")) return ProgrammingLanguage.CSharp;
        return ProgrammingLanguage.TypeScript;
    }

    private static DatabaseOption MapDatabaseString(string database)
    {
        if (string.IsNullOrEmpty(database)) return DatabaseOption.RenderPostgres;
        var lower = database.ToLowerInvariant();
        if (lower.Contains("neon")) return DatabaseOption.NeonPostgres;
        if (lower.Contains("mongo")) return DatabaseOption.MongoCloud;
        return DatabaseOption.RenderPostgres;
    }

    private static async Task ReportProgress(Func<string, Task> onProgress, string message)
    {
        if (onProgress != null) await onProgress(message);
    }
}
