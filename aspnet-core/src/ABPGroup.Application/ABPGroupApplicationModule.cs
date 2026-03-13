using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using ABPGroup.Authorization;

namespace ABPGroup;

[DependsOn(
    typeof(ABPGroupCoreModule),
    typeof(AbpAutoMapperModule))]
public class ABPGroupApplicationModule : AbpModule
{
    public override void PreInitialize()
    {
        Configuration.Authorization.Providers.Add<ABPGroupAuthorizationProvider>();
    }

    public override void Initialize()
    {
        var thisAssembly = typeof(ABPGroupApplicationModule).GetAssembly();

        IocManager.RegisterAssemblyByConvention(thisAssembly);

        Configuration.Modules.AbpAutoMapper().Configurators.Add(
            // Scan the assembly for classes which inherit from AutoMapper.Profile
            cfg => cfg.AddMaps(thisAssembly)
        );
    }
}
