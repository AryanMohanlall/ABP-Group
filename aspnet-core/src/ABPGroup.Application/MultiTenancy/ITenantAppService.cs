using Abp.Application.Services;
using ABPGroup.MultiTenancy.Dto;

namespace ABPGroup.MultiTenancy;

public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
{
}

