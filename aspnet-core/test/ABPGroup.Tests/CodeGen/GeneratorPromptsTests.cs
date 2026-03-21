using ABPGroup.CodeGen.Dto;
using ABPGroup.CodeGen.PromptTemplates;
using Xunit;

namespace ABPGroup.Tests.CodeGen
{
    public class GeneratorPromptsTests
    {
        [Fact]
        public void BuildLayerPrompt_AllowsNullSpec()
        {
            var prompt = GeneratorPrompts.BuildLayerPrompt(
                "frontend pages and components",
                null,
                new StackConfigDto
                {
                    Framework = "Next.js",
                    Language = "TypeScript"
                },
                null);

            Assert.Contains("frontend pages and components", prompt);
            Assert.Contains("for a Next.js application", prompt);
            Assert.Contains("Entities:", prompt);
            Assert.Contains("Pages:", prompt);
            Assert.Contains("API Routes:", prompt);
        }

        [Fact]
        public void BuildLayerPrompt_UsesApprovedReadmeAsSourceOfTruth()
        {
            var prompt = GeneratorPrompts.BuildLayerPrompt(
                "frontend pages and components",
                new AppSpecDto(),
                new StackConfigDto { Framework = "Next.js" },
                "FILE: package.json",
                "# Reviewed App\n\nThis README is approved.");

            Assert.Contains("APPROVED README", prompt);
            Assert.Contains("This README is approved.", prompt);
        }
    }
}
