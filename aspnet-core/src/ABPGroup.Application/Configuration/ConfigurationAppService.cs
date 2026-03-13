using Abp.Authorization;
using Abp.Runtime.Session;
using ABPGroup.Configuration.Dto;
using System.Threading.Tasks;

namespace ABPGroup.Configuration;

[AbpAuthorize]
public class ConfigurationAppService : ABPGroupAppServiceBase, IConfigurationAppService
{
    public async Task ChangeUiTheme(ChangeUiThemeInput input)
    {
        await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
    }
}
