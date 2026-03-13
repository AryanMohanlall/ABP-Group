using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace ABPGroup.Controllers
{
    public abstract class ABPGroupControllerBase : AbpController
    {
        protected ABPGroupControllerBase()
        {
            LocalizationSourceName = ABPGroupConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
