using System.Threading.Tasks;
using Abp.Dependency;

namespace ABPGroup.CodeGen;

public interface IClaudeApiClient : ITransientDependency
{
    Task<string> CallClaudeAsync(string systemPrompt, string userPrompt);
}
