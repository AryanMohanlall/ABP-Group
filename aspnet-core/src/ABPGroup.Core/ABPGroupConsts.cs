using ABPGroup.Debugging;

namespace ABPGroup;

public class ABPGroupConsts
{
    public const string LocalizationSourceName = "ABPGroup";

    public const string ConnectionStringName = "Default";

    public const bool MultiTenancyEnabled = true;


    /// <summary>
    /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
    /// </summary>
    public static readonly string DefaultPassPhrase =
        DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "efca21e833274dc3b10c63aed097e119";
}
