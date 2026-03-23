namespace ABPGroup.CodeGen.Dto;

/// <summary>
/// A successful generation example used to guide future AI generations.
/// </summary>
public class FewShotExampleDto
{
    /// <summary>
    /// Short description of the example app (e.g. "Task management app with CRUD").
    /// </summary>
    public string Description { get; set; }

    /// <summary>
    /// Stack used (e.g. "Next.js + TypeScript + Prisma + Ant Design").
    /// </summary>
    public string Stack { get; set; }

    /// <summary>
    /// The user prompt/requirement that produced this example.
    /// </summary>
    public string Prompt { get; set; }

    /// <summary>
    /// The successful GeneratorOutputDto JSON that was produced.
    /// </summary>
    public string ResponseJson { get; set; }
}