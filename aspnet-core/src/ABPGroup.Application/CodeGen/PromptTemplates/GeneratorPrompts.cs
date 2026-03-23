using System.Collections.Generic;
using System.Linq;
using System.Text;
using ABPGroup.CodeGen.Dto;

namespace ABPGroup.CodeGen.PromptTemplates;

public static class GeneratorPrompts
{
    /// <summary>
    /// Default required files for Next.js App Router projects.
    /// </summary>
    public static readonly List<string> DefaultNextJsRequiredFiles = new()
    {
        "package.json",
        "tsconfig.json",
        "next.config.ts",
        "src/app/layout.tsx",
        "src/app/page.tsx",
        "prisma/schema.prisma",
        ".env.example"
    };

    /// <summary>
    /// Default required files for React Vite projects.
    /// </summary>
    public static readonly List<string> DefaultViteRequiredFiles = new()
    {
        "package.json",
        "tsconfig.json",
        "index.html",
        "src/App.tsx",
        "src/main.tsx",
        ".env.example"
    };

    /// <summary>
    /// Self-check rules that the AI must evaluate.
    /// </summary>
    public static readonly List<(string Rule, string Description)> SelfCheckRules = new()
    {
        ("all-imports-resolve", "Every import in every generated file points to a file that exists in the output or the scaffold baseline."),
        ("no-todos-or-placeholders", "No TODO, FIXME, placeholder, or mock code exists in any generated file."),
        ("scaffold-compatibility", "Output does not break the scaffold build system, routing conventions, or framework version."),
        ("routes-and-apis-aligned", "Every API route in the spec has a corresponding handler file. Every frontend call targets an existing route."),
        ("dependencies-compatible", "All added packages in package.json are compatible with the scaffold. No version conflicts."),
        ("schema-consistent", "Prisma schema entities match the spec. Field types are valid. Relations are correctly defined."),
        ("auth-wired-end-to-end", "If auth is required, session/token handling, protected routes, and login state are fully wired."),
        ("env-vars-declared", "All required environment variables are listed in .env.example with descriptions.")
    };

    /// <summary>
    /// Builds the full-generation prompt for flows that generate the entire application in one shot.
    /// </summary>
    public static string BuildFullGenerationPrompt(
        AppSpecDto spec,
        StackConfigDto stack,
        string scaffoldBaseline,
        string approvedReadme = null,
        List<string> requiredFiles = null,
        string fewShotExample = null,
        string knownFailures = null,
        StackCompatibilityResultDto compatibilityResult = null)
    {
        return BuildLayerPrompt("full application", spec, stack, scaffoldBaseline, approvedReadme, requiredFiles, fewShotExample, knownFailures, compatibilityResult);
    }

    /// <summary>
    /// Builds a layer-specific generation prompt using the reviewed plan and scaffold as the source of truth.
    /// Returns structured JSON output with embedded self-check validation.
    /// </summary>
    public static string BuildLayerPrompt(
        string layerDescription,
        AppSpecDto spec,
        StackConfigDto stack,
        string scaffoldBaseline,
        string approvedReadme = null,
        List<string> requiredFiles = null,
        string fewShotExample = null,
        string knownFailures = null,
        StackCompatibilityResultDto compatibilityResult = null)
    {
        spec ??= new AppSpecDto();
        scaffoldBaseline ??= string.Empty;

        var framework = stack?.Framework ?? "Next.js";
        var resolvedRequiredFiles = ResolveRequiredFiles(requiredFiles, framework);

        var sb = new StringBuilder();

        // ── ROLE ──
        sb.AppendLine($@"You are a principal full-stack engineer generating COMPLETE, RUNNABLE, PRODUCTION-SAFE {layerDescription} for a {framework} application.

Your output will be parsed as JSON. You MUST return a valid JSON object matching the schema defined below. Do NOT include any text outside the JSON object.");

        // ── STACK CONTEXT ──
        if (stack != null)
        {
            sb.AppendLine($@"
STACK CONFIGURATION:
- Framework: {stack.Framework}
- Language: {stack.Language}
- Styling: {stack.Styling}
- Database: {stack.Database}
- ORM: {stack.Orm}
- Auth: {stack.Auth}");
        }

        // ── STACK COMPATIBILITY VIOLATIONS ──
        if (compatibilityResult != null && !compatibilityResult.IsValid)
        {
            sb.AppendLine($@"
{compatibilityResult.FormatForPrompt()}");
        }

        // ── APPROVED README ──
        if (!string.IsNullOrWhiteSpace(approvedReadme))
        {
            sb.AppendLine($@"
APPROVED README (use this exact reviewed scope during scaffolding and generation):
{approvedReadme}");
        }

        // ── SCAFFOLD BASELINE ──
        sb.AppendLine($@"
SCAFFOLD BASELINE (treat as source of truth for existing files):
{scaffoldBaseline}");

        // ── SPECIFICATION ──
        sb.AppendLine($@"
SPECIFICATION:
Entities: {string.Join(", ", spec.Entities?.Select(e => e.Name) ?? new List<string>())}
Pages: {string.Join(", ", spec.Pages?.Select(p => p.Route) ?? new List<string>())}
API Routes: {string.Join(", ", spec.ApiRoutes?.Select(r => $"{r.Method} {r.Path}") ?? new List<string>())}");

        if (spec.DependencyPlan?.Dependencies?.Count > 0)
        {
            sb.AppendLine($@"
ADDITIONAL DEPENDENCIES TO ADD:
{string.Join("\n", spec.DependencyPlan.Dependencies.Where(d => !d.IsExisting).Select(d => $"- {d.Name}@{d.Version} ({d.Purpose})"))}");
        }

        if (spec.DependencyPlan?.EnvVars?.Count > 0)
        {
            sb.AppendLine($@"
REQUIRED ENVIRONMENT VARIABLES:
{string.Join("\n", spec.DependencyPlan.EnvVars.Select(e => $"- {e.Key}: {e.Value}"))}");
        }

        // ── REQUIRED FILES CHECKLIST ──
        sb.AppendLine($@"
REQUIRED FILES CHECKLIST:
You MUST generate ALL of the following files. Each file listed here must appear in your ""files"" array.");
        foreach (var file in resolvedRequiredFiles)
        {
            sb.AppendLine($"- [ ] {file}");
        }

        // ── KNOWN FAILURES ──
        if (!string.IsNullOrWhiteSpace(knownFailures))
        {
            sb.AppendLine($@"
KNOWN FAILURES FROM PREVIOUS ATTEMPTS (avoid these patterns):
{knownFailures}");
        }

        // ── FEW-SHOT EXAMPLE ──
        if (!string.IsNullOrWhiteSpace(fewShotExample))
        {
            sb.AppendLine($@"
FEW-SHOT EXAMPLE (a successful generation for a similar project — follow this structure):
{fewShotExample}");
        }

        // ── RULES ──
        sb.AppendLine(@"
NON-NEGOTIABLE RULES
1. Generate real, working code only. No TODOs, placeholders, pseudo-code, mock implementations, or omitted sections.
2. Every import must resolve. Every referenced file, route, schema, API, env var, component, and utility must either already exist in the provided context or be created in your output.
3. The result must compile and run inside the provided scaffold/template. Do not invent a different architecture than the scaffold supports.
4. Use the latest stable dependency versions COMPATIBLE with the chosen framework and scaffold.
5. If the scaffold already includes a package.json, tsconfig, prisma schema, layout, theme, or config files, treat those versions and conventions as the baseline source of truth. Only add or update packages when required for the requested feature set.
6. Prefer current, non-deprecated APIs for the selected stack. Avoid legacy patterns.
7. If auth is required, wire the full flow end-to-end: session/token handling, protected routes, login state, and server/client boundaries.
8. If database access is required, ensure schema, data access, and API usage are consistent with each other.
9. If an API route is created, the frontend must call the correct path and shape. If the frontend calls a route, that route must exist.
10. If environment variables are required, include the relevant .env.example or config placeholders in generated files.
11. Do not break the scaffold's build system, linting assumptions, routing conventions, or framework version compatibility.
12. Optimize for a WORKING APPLICATION over cleverness.
13. If generating for Next.js, you MUST use the App Router (src/app directory structure). DO NOT output files to a legacy /pages directory.
14. You MUST include every file from the REQUIRED FILES CHECKLIST in your output.

QUALITY BAR
- Complete file contents, not partial snippets
- Type-safe code
- Correct imports and exports
- Loading, empty, success, and error states where relevant
- Minimal but real validation
- Accessible and responsive UI
- Sensible defaults
- No dead code
- No duplicated logic when a utility/component can be shared

DEPENDENCY POLICY
- Prefer the scaffold's existing dependencies first.
- Add the fewest extra packages necessary.
- When adding packages, choose current stable versions compatible with the scaffold.
- If a dependency change is required, also output the necessary package/config file changes.");

        // ── OUTPUT FORMAT ──
        sb.AppendLine(@"
OUTPUT FORMAT
You MUST return a single valid JSON object. No markdown fences, no commentary before or after.

JSON SCHEMA:
{
  ""architecture"": ""<brief description of this layer and how it fits the app>"",
  ""modules"": [""<comma-separated module names>""],
  ""files"": [
    {
      ""path"": ""<file path relative to project root>"",
      ""content"": ""<full file content>""
    }
  ],
  ""requiredFiles"": [""<list of all file paths you committed to generating>""
  ],
  ""selfCheck"": {
    ""passed"": true|false,
    ""checks"": [
      {
        ""rule"": ""all-imports-resolve"",
        ""passed"": true|false,
        ""notes"": ""<brief explanation>""
      },
      {
        ""rule"": ""no-todos-or-placeholders"",
        ""passed"": true|false,
        ""notes"": ""<brief explanation>""
      },
      {
        ""rule"": ""scaffold-compatibility"",
        ""passed"": true|false,
        ""notes"": ""<brief explanation>""
      },
      {
        ""rule"": ""routes-and-apis-aligned"",
        ""passed"": true|false,
        ""notes"": ""<brief explanation>""
      },
      {
        ""rule"": ""dependencies-compatible"",
        ""passed"": true|false,
        ""notes"": ""<brief explanation>""
      },
      {
        ""rule"": ""schema-consistent"",
        ""passed"": true|false,
        ""notes"": ""<brief explanation>""
      },
      {
        ""rule"": ""auth-wired-end-to-end"",
        ""passed"": true|false,
        ""notes"": ""<brief explanation>""
      },
      {
        ""rule"": ""env-vars-declared"",
        ""passed"": true|false,
        ""notes"": ""<brief explanation>""
      }
    ]
  }
}

SELF-CHECK RULES (evaluate each honestly before returning):
1. all-imports-resolve: Every import in every generated file points to a file that exists in the output or the scaffold baseline.
2. no-todos-or-placeholders: No TODO, FIXME, placeholder, or mock code exists in any generated file.
3. scaffold-compatibility: Output does not break the scaffold build system, routing conventions, or framework version.
4. routes-and-apis-aligned: Every API route in the spec has a corresponding handler file. Every frontend call targets an existing route.
5. dependencies-compatible: All added packages in package.json are compatible with the scaffold. No version conflicts.
6. schema-consistent: Prisma schema entities match the spec. Field types are valid. Relations are correctly defined.
7. auth-wired-end-to-end: If auth is required, session/token handling, protected routes, and login state are fully wired.
8. env-vars-declared: All required environment variables are listed in .env.example with descriptions.

IMPORTANT: If any self-check rule fails, set ""passed"": false on the overall selfCheck and on the failing rule. Fix the issue in your code before returning. The output will be validated server-side.");

        return sb.ToString();
    }

    /// <summary>
    /// Builds a code generation system prompt for the layer-based generation flow.
    /// </summary>
    public static string BuildCodeGenSystemPrompt(
        string layerDescription,
        AppSpecDto spec,
        StackConfigDto stack,
        string scaffoldBaseline,
        string approvedReadme,
        string existingLayerMetadata = null,
        List<string> requiredFiles = null,
        string fewShotExample = null,
        string knownFailures = null)
    {
        var stackInfo = stack != null ? $@"STACK CONFIGURATION:
- Framework: {stack.Framework}
- Language: {stack.Language}
- Styling: {stack.Styling}
- Database: {stack.Database}
- ORM: {stack.Orm}
- Auth: {stack.Auth}
" : string.Empty;

        var entitiesStr = string.Join(", ", spec?.Entities?.Select(e => e.Name) ?? new List<string>());
        var pagesStr = string.Join(", ", spec?.Pages?.Select(p => p.Route) ?? new List<string>());
        var apiRoutesStr = string.Join(", ", spec?.ApiRoutes?.Select(r => r.Method + " " + r.Path) ?? new List<string>());

        var metadataSection = string.IsNullOrWhiteSpace(existingLayerMetadata)
            ? string.Empty
            : $@"EXISTING LAYER METADATA (Source of Truth for Integration):
{existingLayerMetadata}

";

        var framework = stack?.Framework ?? "Next.js";
        var resolvedRequiredFiles = ResolveRequiredFiles(requiredFiles, framework);

        var sb = new StringBuilder();

        sb.AppendLine($@"You are a principal full-stack engineer generating {layerDescription} for a custom application.

{stackInfo}APPROVED README (Source of Truth for Project Structure):
{approvedReadme}

{metadataSection}SPECIFICATION:
Entities: {entitiesStr}
Pages: {pagesStr}
API Routes: {apiRoutesStr}");

        // Required files checklist
        sb.AppendLine(@"
REQUIRED FILES CHECKLIST:
You MUST generate ALL of the following files.");
        foreach (var file in resolvedRequiredFiles)
        {
            sb.AppendLine($"- [ ] {file}");
        }

        // Known failures
        if (!string.IsNullOrWhiteSpace(knownFailures))
        {
            sb.AppendLine($@"
KNOWN FAILURES FROM PREVIOUS ATTEMPTS (avoid these patterns):
{knownFailures}");
        }

        // Few-shot example
        if (!string.IsNullOrWhiteSpace(fewShotExample))
        {
            sb.AppendLine($@"
FEW-SHOT EXAMPLE (a successful generation — follow this structure):
{fewShotExample}");
        }

        sb.AppendLine(@"
NON-NEGOTIABLE RULES:
1. YOU ARE GENERATING THIS PROJECT FROM SCRATCH. Do NOT assume any files (like package.json, prisma.schema, layouts, or configs) exist unless you create them.
2. YOU MUST FOLLOW THE FOLDER STRUCTURE DEFINED IN THE README. The README is your architectural blueprint.
3. Every import must resolve. Every file you reference must be created in your output.
4. YOUR CODE WILL BE IMMEDIATELY BUILT (npm run build / dotnet build) ON THE SERVER. Any syntax error, missing dependency in package.json, or broken import will fail the validation and your work will be rejected.
5. NO TODOs, placeholders, or partial snippets. Full file content only.
6. BE GENEROUS WITH CODE. Minimal skeletons or ""Hello World"" implementations are strictly forbidden. Implement full business logic, comprehensive UI components with Ant Design, complete data schemas, and detailed error handling for Every feature in the spec.
7. Use modern, production-grade patterns (e.g. Next.js App Router, Zod validation, Prisma, etc.) consistent with the stack.
8. Ensure the README file itself is never deleted; if you modify it, maintain the agreed folder structure.
9. You MUST include every file from the REQUIRED FILES CHECKLIST in your output.

OUTPUT FORMAT:
You MUST return a single valid JSON object. No markdown fences, no commentary before or after.

{
  ""architecture"": ""<brief description>"",
  ""modules"": [""<module names>""],
  ""files"": [
    {
      ""path"": ""<relative path>"",
      ""content"": ""<full content>""
    }
  ],
  ""requiredFiles"": [""<all committed file paths>""],
  ""selfCheck"": {
    ""passed"": true|false,
    ""checks"": [
      { ""rule"": ""all-imports-resolve"", ""passed"": true|false, ""notes"": ""..."" },
      { ""rule"": ""no-todos-or-placeholders"", ""passed"": true|false, ""notes"": ""..."" },
      { ""rule"": ""scaffold-compatibility"", ""passed"": true|false, ""notes"": ""..."" },
      { ""rule"": ""routes-and-apis-aligned"", ""passed"": true|false, ""notes"": ""..."" },
      { ""rule"": ""dependencies-compatible"", ""passed"": true|false, ""notes"": ""..."" },
      { ""rule"": ""schema-consistent"", ""passed"": true|false, ""notes"": ""..."" },
      { ""rule"": ""auth-wired-end-to-end"", ""passed"": true|false, ""notes"": ""..."" },
      { ""rule"": ""env-vars-declared"", ""passed"": true|false, ""notes"": ""..."" }
    ]
  }
}

SELF-CHECK RULES (evaluate each honestly):
1. all-imports-resolve: Every import points to a file in the output or scaffold.
2. no-todos-or-placeholders: No TODO, FIXME, placeholder, or mock code.
3. scaffold-compatibility: Does not break build system or conventions.
4. routes-and-apis-aligned: All API routes have handlers. All frontend calls target existing routes.
5. dependencies-compatible: All packages compatible. No version conflicts.
6. schema-consistent: Prisma schema matches spec. Valid field types and relations.
7. auth-wired-end-to-end: Auth fully wired if required.
8. env-vars-declared: All env vars in .env.example with descriptions.

IMPORTANT: If any check fails, fix it before returning. Set ""passed"": false on failing rules.");

        return sb.ToString();
    }

    /// <summary>
    /// Builds the user prompt for a layer generation request.
    /// </summary>
    public static string BuildLayerUserPrompt(
        string userInstruction,
        StringBuilder context,
        string originalPrompt,
        string approvedReadme)
    {
        return $@"Instruction: {userInstruction}
Original Requirement: {originalPrompt}
Context: {context}

Generate the code for this layer. Return the complete JSON object matching the schema defined in the system prompt.";
    }

    /// <summary>
    /// Resolves the required files list, falling back to framework defaults.
    /// </summary>
    private static List<string> ResolveRequiredFiles(List<string> requiredFiles, string framework)
    {
        if (requiredFiles != null && requiredFiles.Count > 0)
            return requiredFiles;

        var lower = framework?.ToLowerInvariant() ?? "";
        if (lower.Contains("vite") || lower.Contains("react"))
            return DefaultViteRequiredFiles;

        return DefaultNextJsRequiredFiles;
    }
}