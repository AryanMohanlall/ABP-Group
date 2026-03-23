using System.Collections.Generic;

namespace ABPGroup.CodeGen.Dto;

/// <summary>
/// Structured self-check result returned by the AI after code generation.
/// </summary>
public class SelfCheckDto
{
    public bool Passed { get; set; }
    public List<SelfCheckRuleDto> Checks { get; set; } = new();
}

public class SelfCheckRuleDto
{
    /// <summary>
    /// Rule identifier (e.g. "all-imports-resolve", "no-todos-or-placeholders").
    /// </summary>
    public string Rule { get; set; }

    /// <summary>
    /// Whether this rule passed.
    /// </summary>
    public bool Passed { get; set; }

    /// <summary>
    /// Optional notes explaining the evaluation.
    /// </summary>
    public string Notes { get; set; }
}