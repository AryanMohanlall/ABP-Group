using System;
using System.Collections.Generic;
using System.Reflection;
using ABPGroup.CodeGen;
using ABPGroup.CodeGen.Dto;
using Xunit;

namespace ABPGroup.Tests.CodeGen
{
    public class CodeGenValidationTests
    {
        [Fact]
        public void BuildInitialValidationResults_IncludesNextShellChecks()
        {
            var results = InvokeValidationMethod<List<ValidationResultDto>>(
                "BuildInitialValidationResults",
                new List<ValidationRuleDto>(),
                new StackConfigDto { Framework = "Next.js" });

            Assert.Contains(results, result => result.Id == "shell-next-home-page");
            Assert.Contains(results, result => result.Id == "shell-required-layout");
            Assert.Contains(results, result => result.Id == "shell-styled-home-route");
        }

        [Fact]
        public void EvaluateValidationResults_FailsWhenNextHomeShellIsMissing()
        {
            var results = InvokeValidationMethod<List<ValidationResultDto>>(
                "EvaluateValidationResults",
                new List<ValidationRuleDto>(),
                new List<GeneratedFile>
                {
                    new() { Path = "package.json", Content = "{}" },
                    new() { Path = "src/app/layout.tsx", Content = "export default function Layout({ children }) { return <html><body>{children}</body></html>; }" }
                },
                new StackConfigDto { Framework = "Next.js" });

            Assert.Contains(results, result => result.Id == "shell-next-home-page" && result.Status == "failed");
            Assert.Contains(results, result => result.Id == "shell-required-layout" && result.Status == "passed");
            Assert.Contains(results, result => result.Id == "shell-styled-home-route" && result.Status == "failed");
        }

        [Fact]
        public void EvaluateValidationResults_PassesWhenViteShellIsStyled()
        {
            var results = InvokeValidationMethod<List<ValidationResultDto>>(
                "EvaluateValidationResults",
                new List<ValidationRuleDto>(),
                new List<GeneratedFile>
                {
                    new() { Path = "package.json", Content = "{}" },
                    new() { Path = "index.html", Content = "<!doctype html><html><body><div id=\"root\"></div></body></html>" },
                    new() { Path = "src/App.tsx", Content = "export default function App() { return <main className=\"min-h-screen bg-slate-950 text-white\">Hello</main>; }" }
                },
                new StackConfigDto { Framework = "React + Vite" });

            Assert.Contains(results, result => result.Id == "shell-vite-index-html" && result.Status == "passed");
            Assert.Contains(results, result => result.Id == "shell-required-layout" && result.Status == "passed");
            Assert.Contains(results, result => result.Id == "shell-styled-home-route" && result.Status == "passed");
        }

        private static T InvokeValidationMethod<T>(string methodName, params object[] parameters)
        {
            var method = typeof(CodeGenAppService).GetMethod(
                methodName,
                BindingFlags.NonPublic | BindingFlags.Static);

            Assert.NotNull(method);
            return (T)method.Invoke(null, parameters);
        }
    }
}
