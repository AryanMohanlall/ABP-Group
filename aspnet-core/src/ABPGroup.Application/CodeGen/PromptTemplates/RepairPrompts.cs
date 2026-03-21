using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ABPGroup.CodeGen.Dto;

namespace ABPGroup.CodeGen.PromptTemplates;

public static class RepairPrompts
{
    private const int FallbackContextFileLimit = 12;

    public static string BuildRepairPrompt(
        List<ValidationResultDto> failures,
        AppSpecDto spec,
        List<GeneratedFileDto> currentFiles,
        List<string> affectedPaths)
    {
        failures ??= new List<ValidationResultDto>();
        currentFiles ??= new List<GeneratedFileDto>();
        var relevantFiles = SelectRelevantFiles(currentFiles, affectedPaths);
        var sb = new StringBuilder();

        sb.AppendLine(@"You are an expert code repair agent. The generated code has validation failures that must be fixed using targeted diffs.

CRITICAL RULES:
1. Make the smallest possible set of changes needed to fix the failures.
2. Return ONLY files that need to change. Do NOT return unchanged files.
3. Preserve all working code outside the failing areas.
4. If a required shell file is missing, create it at the canonical path listed below.
5. If a landing/home route is missing styling, repair that route in place instead of creating a duplicate route.
6. Ensure all imports resolve after your changes.
7. No TODOs, placeholders, or incomplete implementations.
8. The result must compile and run.
9. For Next.js, always use the App Router (src/app/) and never the legacy /pages directory.");

        sb.AppendLine("\nVALIDATION FAILURES:");
        foreach (var failure in failures.Where(f => f.Status == "failed"))
        {
            sb.AppendLine($"- [{failure.Id}] {failure.Message}");
        }

        if (affectedPaths?.Count > 0)
        {
            sb.AppendLine("\nEXPECTED AFFECTED FILES:");
            sb.AppendLine(string.Join("\n", affectedPaths.Select(path => $"- {path}")));
        }

        if (spec?.Pages?.Count > 0)
        {
            sb.AppendLine("\nCURRENT PAGES:");
            sb.AppendLine(string.Join("\n", spec.Pages.Select(page => $"- {page.Route} ({page.Name})")));
        }

        if (spec?.ApiRoutes?.Count > 0)
        {
            sb.AppendLine("\nCURRENT API ROUTES:");
            sb.AppendLine(string.Join("\n", spec.ApiRoutes.Select(route => $"- {route.Method} {route.Path}")));
        }

        sb.AppendLine("\nCURRENT FILE MANIFEST:");
        sb.AppendLine(string.Join("\n", currentFiles.Select(f => $"- {f.Path}")));

        sb.AppendLine("\nRELEVANT CURRENT FILE CONTENTS:");
        sb.AppendLine(string.Join("\n---\n", relevantFiles.Select(f => $"### {f.Path}\n{f.Content}")));

        sb.AppendLine(@"

RETURN FORMAT:
===SUMMARY===
<brief description of the diff-based repair>
===END SUMMARY===

For each file that needs fixing:

===FILE===
<file path relative to project root>
===CONTENT===
<corrected full file content>
===END FILE===

For DELETED files:

===DELETED===
<file path relative to project root>
===END DELETED===

Only return files that need changes. Do not return files that are already correct.

SELF-CHECK BEFORE RETURNING:
- Did I fix all validation failures?
- Did I keep the repair tightly scoped to the affected files?
- Did I avoid introducing new issues?
- Do all imports resolve?
- Will the app still compile?");

        return sb.ToString();
    }

    private static List<GeneratedFileDto> SelectRelevantFiles(
        List<GeneratedFileDto> currentFiles,
        List<string> affectedPaths)
    {
        currentFiles ??= new List<GeneratedFileDto>();
        affectedPaths ??= new List<string>();

        if (currentFiles.Count == 0)
            return currentFiles;

        var normalizedTargets = new HashSet<string>(
            affectedPaths
                .Where(path => !string.IsNullOrWhiteSpace(path))
                .Select(NormalizePath),
            StringComparer.OrdinalIgnoreCase);

        var relevantFiles = currentFiles
            .Where(file => normalizedTargets.Contains(NormalizePath(file.Path)))
            .ToList();

        if (relevantFiles.Count > 0)
            return relevantFiles;

        return currentFiles
            .Take(FallbackContextFileLimit)
            .ToList();
    }

    private static string NormalizePath(string path)
    {
        if (string.IsNullOrWhiteSpace(path))
            return string.Empty;

        return path.Replace('\\', '/').Trim().TrimStart('/');
    }
}
