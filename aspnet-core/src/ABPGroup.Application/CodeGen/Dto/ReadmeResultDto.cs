namespace ABPGroup.CodeGen.Dto;

/// <summary>
/// Carries the approved README together with the structured implementation plan derived from it.
/// </summary>
public class ReadmeResultDto
{
    public string ReadmeMarkdown { get; set; }
    public string Summary { get; set; }
    public AppSpecDto Plan { get; set; } = new();
}
