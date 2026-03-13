using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using ABPGroup.Configuration;
using ABPGroup.EntityFrameworkCore;
using ABPGroup.Migrator.DependencyInjection;
using Castle.MicroKernel.Registration;
using Microsoft.Extensions.Configuration;

namespace ABPGroup.Migrator;

[DependsOn(typeof(ABPGroupEntityFrameworkModule))]
public class ABPGroupMigratorModule : AbpModule
{
    private readonly IConfigurationRoot _appConfiguration;

    public ABPGroupMigratorModule(ABPGroupEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

        _appConfiguration = AppConfigurations.Get(
            typeof(ABPGroupMigratorModule).GetAssembly().GetDirectoryPathOrNull()
        );
    }

    public override void PreInitialize()
    {
        Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
            ABPGroupConsts.ConnectionStringName
        );

        Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        Configuration.ReplaceService(
            typeof(IEventBus),
            () => IocManager.IocContainer.Register(
                Component.For<IEventBus>().Instance(NullEventBus.Instance)
            )
        );
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(ABPGroupMigratorModule).GetAssembly());
        ServiceCollectionRegistrar.Register(IocManager);
    }
}
