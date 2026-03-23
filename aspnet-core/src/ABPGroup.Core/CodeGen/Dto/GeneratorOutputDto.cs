using System.Collections.Generic;

namespace ABPGroup.CodeGen.Dto;

/// <summary>
/// Structured JSON envelope returned by the AI during code generation.
/// Replaces the legacy ===FILE=== delimiter format.
/// </summary>
public class GeneratorOutputDto
{
    /// <summary>
    /// Brief description of this layer and how it fits the app.
    /// </summary>
    public string Architecture { get; set; }

    /// <summary>
    /// Module names included in this generation.
    /// </summary>
    public List<string> Modules { get; set; } = new();

    /// <summary>
    /// Generated files with their paths and full content.
    /// </summary>
    public List<GeneratorFileDto> Files { get; set; } = new();

    /// <summary>
    /// List of file paths the AI committed to generating.
    /// Must be a superset of the required files checklist provided in the prompt.
    /// </summary>
    public List<string> RequiredFiles { get; set; } = new();

    /// <summary>
    /// Structured self-check result evaluating quality rules.
    /// </summary>
    public SelfCheckDto SelfCheck { get; set; } = new();
}

public class GeneratorFileDto
{
    /// <summary>
    /// File path relative to project root (e.g. "src/app/page.tsx").
    /// </summary>
    public string Path { get; set; }

    /// <summary>
    /// Full file content.
    /// </summary>
    public string Content { get; set; }
}