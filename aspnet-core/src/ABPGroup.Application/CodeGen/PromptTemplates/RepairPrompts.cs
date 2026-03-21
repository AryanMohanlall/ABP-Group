using System.Collections.Generic;
using System.Linq;
using System.Text;
using ABPGroup.CodeGen.Dto;

namespace ABPGroup.CodeGen.PromptTemplates;

public static class RepairPrompts
{
    public static string BuildRepairPrompt(
        List<ValidationResultDto> failures,
        List<GeneratedFileDto> currentFiles)
    {
        var sb = new StringBuilder();

        sb.AppendLine(@"You are an expert code repair agent. The generated code has validation failures that must be fixed.

CRITICAL RULES:
1. Return ONLY files that need to change. Do NOT return unchanged files.
2. Fix all validation failures listed below.
3. Do not introduce new issues while fixing existing ones.
4. Ensure all imports resolve after your changes.
5. No TODOs, placeholders, or incomplete implementations.
6. The result must compile and run.");

        sb.AppendLine("\nVALIDATION FAILURES:");
        foreach (var failure in failures.Where(f => f.Status == "failed"))
        {
            sb.AppendLine($"- [{failure.Id}] {failure.Message}");
        }

        sb.AppendLine("\nCURRENT FILE MANIFEST:");
        sb.AppendLine(string.Join("\n", currentFiles.Select(f => $"- {f.Path}")));

        sb.AppendLine("\nCURRENT FILE CONTENTS:");
        sb.AppendLine(string.Join("\n---\n", currentFiles.Select(f => $"### {f.Path}\n{f.Content}")));

        sb.AppendLine(@"

RETURN FORMAT:
For each file that needs fixing:

===FILE===
<file path relative to project root>
===CONTENT===
<corrected full file content>
===END FILE===

Only return files that need changes. Do not return files that are already correct.

SELF-CHECK BEFORE RETURNING:
- Did I fix all validation failures?
- Did I avoid introducing new issues?
- Do all imports resolve?
- Will the app still compile?");

        return sb.ToString();
    }
}