using Abp.Application.Services;
using ABPGroup.Sessions.Dto;
using System.Threading.Tasks;

namespace ABPGroup.Sessions;

public interface ISessionAppService : IApplicationService
{
    Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
}
