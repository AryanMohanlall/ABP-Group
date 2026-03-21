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
2. If a file needs to be deleted, include it in the DELETED section.
3. Preserve all working code that is not affected by the change request.
4. Ensure all imports still resolve after your changes.
5. If you add new dependencies, also update package.json.
6. No TODOs, placeholders, or incomplete implementations.
7. The result must still compile and run.");

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

RETURN FORMAT:
===SUMMARY===
<brief description of what you changed and why>
===END SUMMARY===

For each CHANGED file:

===FILE===
<file path relative to project root>
===CONTENT===
<full new file content>
===END FILE===

For DELETED files:

===DELETED===
<file path relative to project root>
===END DELETED===

SELF-CHECK BEFORE RETURNING:
- Did I only change what was requested?
- Do all imports resolve?
- Will the app still compile?
- Did I preserve working code?");

        return sb.ToString();
    }
}