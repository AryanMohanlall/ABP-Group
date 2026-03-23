using System.Collections.Generic;
using System.Linq;

namespace ABPGroup.CodeGen.Dto;

/// <summary>
/// Result of validating a stack configuration against compatibility rules.
/// </summary>
public class StackCompatibilityResultDto
{
    public bool IsValid { get; set; }
    public List<StackCompatibilityViolationDto> Violations { get; set; } = new();
    public List<StackCompatibilitySuggestionDto> Suggestions { get; set; } = new();

    /// <summary>
    /// Formats violations and suggestions into a prompt-ready string.
    /// </summary>
    public string FormatForPrompt()
    {
        if (IsValid)
            return string.Empty;

        var lines = new List<string> { "STACK COMPATIBILITY VIOLATIONS (these MUST be corrected):" };
        foreach (var v in Violations)
        {
            lines.Add($"- [{v.Field}] {v.Message} (current: \"{v.Value}\")");
        }

        if (Suggestions.Count > 0)
        {
            lines.Add("");
            lines.Add("SUGGESTED CORRECTIONS:");
            foreach (var s in Suggestions)
            {
                lines.Add($"- {s.Field}: change to \"{s.SuggestedValue}\" ({s.Reason})");
            }
        }

        return string.Join("\n", lines);
    }
}

public class StackCompatibilityViolationDto
{
    /// <summary>
    /// The field that has the violation (e.g. "Orm", "Language").
    /// </summary>
    public string Field { get; set; }

    /// <summary>
    /// Human-readable description of the violation.
    /// </summary>
    public string Message { get; set; }

    /// <summary>
    /// The invalid value.
    /// </summary>
    public string Value { get; set; }
}

public class StackCompatibilitySuggestionDto
{
    /// <summary>
    /// The field to change.
    /// </summary>
    public string Field { get; set; }

    /// <summary>
    /// Suggested replacement value.
    /// </summary>
    public string SuggestedValue { get; set; }

    /// <summary>
    /// Why this suggestion is recommended.
    /// </summary>
    public string Reason { get; set; }
}