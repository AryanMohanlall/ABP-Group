using Abp.Authorization;
using ABPGroup.Authorization.Roles;
using ABPGroup.Authorization.Users;

namespace ABPGroup.Authorization;

public class PermissionChecker : PermissionChecker<Role, User>
{
    public PermissionChecker(UserManager userManager)
        : base(userManager)
    {
    }
}
