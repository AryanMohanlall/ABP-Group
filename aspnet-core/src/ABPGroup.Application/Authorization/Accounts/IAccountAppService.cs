using Abp.Application.Services;
using ABPGroup.Authorization.Accounts.Dto;
using System.Threading.Tasks;

namespace ABPGroup.Authorization.Accounts;

public interface IAccountAppService : IApplicationService
{
    Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

    Task<RegisterOutput> Register(RegisterInput input);
}
