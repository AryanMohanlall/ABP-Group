using System.Collections.Generic;
using System.Linq;
using System.Text;
using ABPGroup.CodeGen.Dto;

namespace ABPGroup.CodeGen.PromptTemplates;

public static class RefinementPrompts
{
    public static string BuildDiffPrompt(
        string changeRequest,
        AppSpecDto spec,
        List<GeneratedFileDto> currentFiles,
        List<string> affectedPaths)
    {
        var sb = new StringBuilder();

        sb.AppendLine(@"You are an expert code refactoring agent. Your task is to make targeted changes to an existing codebase.

CRITICAL RULES:
1. Return ONLY files that need to change. Do NOT return unchanged files.
2. Preserve all working code that is not affected by the change request.
3. Ensure all imports still resolve after your changes.
4. If you add new dependencies, also update package.json.
5. No TODOs, placeholders, or incomplete implementations.
6. The result must still compile and run.

OUTPUT FORMAT:
You MUST return a single valid JSON object matching this schema. No markdown fences, no commentary.

{
  ""architecture"": ""<brief description of what you changed and why>"",
  ""modules"": [""<module names>""],
  ""files"": [
    {
      ""path"": ""<file path relative to project root>"",
      ""content"": ""<full new file content>""
    }
  ],
  ""requiredFiles"": [""<all file paths changed>""],
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
}");

        sb.AppendLine("\nCHANGE REQUEST:");
        sb.AppendLine(changeRequest);

        if (affectedPaths?.Count > 0)
        {
            sb.AppendLine("\nEXPECTED AFFECTED FILES (you may change more if needed):");
            sb.AppendLine(string.Join("\n", affectedPaths.Select(p => $"- {p}")));
        }

        if (spec?.Entities?.Count > 0)
        {
            sb.AppendLine("\nCURRENT ENTITIES:");
            foreach (var entity in spec.Entities)
            {
                sb.AppendLine($"- {entity.Name}: {string.Join(", ", entity.Fields?.Select(f => f.Name) ?? new List<string>())}");
            }
        }

        if (spec?.Pages?.Count > 0)
        {
            sb.AppendLine("\nCURRENT PAGES:");
            sb.AppendLine(string.Join("\n", spec.Pages.Select(p => $"- {p.Route} ({p.Name})")));
        }

        if (spec?.ApiRoutes?.Count > 0)
        {
            sb.AppendLine("\nCURRENT API ROUTES:");
            sb.AppendLine(string.Join("\n", spec.ApiRoutes.Select(r => $"- {r.Method} {r.Path}")));
        }

        sb.AppendLine("\nCURRENT FILE MANIFEST:");
        sb.AppendLine(string.Join("\n", currentFiles.Select(f => $"- {f.Path}")));

        sb.AppendLine("\nCURRENT FILE CONTENTS:");
        sb.AppendLine(string.Join("\n---\n", currentFiles.Select(f => $"### {f.Path}\n{f.Content}")));

        sb.AppendLine(@"

SELF-CHECK BEFORE RETURNING:
- Did I only change what was requested?
- Do all imports resolve?
- Will the app still compile?
- Did I preserve working code?
Set ""passed"": false on any rule that fails. Fix it before returning.");

        return sb.ToString();
    }
}