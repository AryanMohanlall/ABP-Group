using ABPGroup.Configuration.Dto;
using System.Threading.Tasks;

namespace ABPGroup.Configuration;

public interface IConfigurationAppService
{
    Task ChangeUiTheme(ChangeUiThemeInput input);
}
