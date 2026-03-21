namespace ABPGroup.CodeGen;

public enum GenerationMode
{
    Full = 1,       // first generation from spec
    Refinement = 2, // diff-based update
    Repair = 3      // fix validation failures
}