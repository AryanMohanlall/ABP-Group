(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/Sidebar/styles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useStyles",
    ()=>useStyles
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2d$style$2f$es$2f$functions$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/antd-style/es/functions/index.js [app-client] (ecmascript) <locals>");
;
const useStyles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2d$style$2f$es$2f$functions$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStyles"])(({ token, css })=>({
        sidebar: css`
    width: var(--sidebar-width, ${token.paddingXL * 6.5}px);
    height: 100vh;
    background: ${token.colorText};
    color: ${token.colorBgContainer};
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    position: fixed;
    left: 0;
    top: 0;
  `,
        content: css`
    padding: ${token.paddingLG}px;
    display: flex;
    flex-direction: column;
    height: 100%;
  `,
        brand: css`
    font-size: ${token.fontSizeLG}px;
    font-weight: ${token.fontWeightStrong};
    margin: 0 0 ${token.marginXL}px;
    color: ${token.colorBgContainer};
  `,
        newButton: css`
    width: 100%;
    border: none;
    border-radius: ${token.borderRadiusLG * 1.5}px;
    background: ${token.colorPrimary};
    color: ${token.colorBgContainer};
    padding: ${token.paddingSM * 1.5}px ${token.paddingLG}px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${token.fontWeightStrong};
    box-shadow: ${token.boxShadowSecondary};
    cursor: pointer;
    transition: transform 0.2s ease, filter 0.2s ease;
    margin-bottom: ${token.marginXL}px;

    &:hover {
      filter: brightness(1.05);
    }

    &:active {
      transform: scale(0.98);
    }
  `,
        newIcon: css`
    width: ${token.fontSizeLG}px;
    height: ${token.fontSizeLG}px;
    margin-right: ${token.marginSM}px;
  `,
        nav: css`
    display: flex;
    flex-direction: column;
    gap: ${token.marginSM / 2}px;
  `,
        navButton: css`
    width: 100%;
    display: flex;
    align-items: center;
    padding: ${token.paddingSM}px ${token.padding}px;
    border-radius: ${token.borderRadiusLG * 1.5}px;
    border: none;
    background: transparent;
    color: ${token.colorTextSecondary};
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      color: ${token.colorBgContainer};
    }
  `,
        navButtonActive: css`
    background: rgba(255, 255, 255, 0.12);
    color: ${token.colorBgContainer};
    font-weight: ${token.fontWeightStrong};
  `,
        navIcon: css`
    width: ${token.fontSizeLG}px;
    height: ${token.fontSizeLG}px;
    margin-right: ${token.marginSM}px;
  `,
        navIconActive: css`
    color: ${token.colorPrimary};
  `,
        adminLabel: css`
    margin: ${token.marginXL}px ${token.paddingSM}px ${token.marginSM}px;
    font-size: ${token.fontSizeSM}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorTextSecondary};
    text-transform: uppercase;
    letter-spacing: 0.08em;
  `,
        divider: css`
    height: 1px;
    background: rgba(255, 255, 255, 0.12);
    margin: 0 ${token.paddingSM}px ${token.marginSM}px;
  `,
        footer: css`
    margin-top: auto;
    padding-top: ${token.padding}px;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  `,
        profileButton: css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${token.marginSM}px;
    padding: ${token.paddingSM}px;
    border-radius: ${token.borderRadiusLG * 1.5}px;
    border: none;
    background: transparent;
    color: ${token.colorBgContainer};
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }
  `,
        logoutButton: css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${token.marginSM}px;
    margin-top: ${token.marginSM}px;
    padding: ${token.paddingSM}px ${token.padding}px;
    border-radius: ${token.borderRadiusLG * 1.5}px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: transparent;
    color: ${token.colorTextSecondary};
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      color: ${token.colorBgContainer};
    }
  `,
        logoutIcon: css`
    width: ${token.fontSize}px;
    height: ${token.fontSize}px;
  `,
        profileInfo: css`
    display: flex;
    align-items: center;
    gap: ${token.marginSM}px;
  `,
        avatar: css`
    width: ${token.paddingXL}px;
    height: ${token.paddingXL}px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${token.fontSizeSM}px;
    font-weight: ${token.fontWeightStrong};
  `,
        profileName: css`
    font-size: ${token.fontSizeSM}px;
    font-weight: ${token.fontWeightStrong};
  `,
        chevron: css`
    width: ${token.fontSize}px;
    height: ${token.fontSize}px;
    color: ${token.colorTextSecondary};
  `,
        focusRing: css`
    &:focus-visible {
      outline: 2px solid ${token.colorPrimary};
      outline-offset: 2px;
    }
  `
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Sidebar/index.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder.js [app-client] (ecmascript) <export default as FolderIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$template$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutTemplateIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-template.js [app-client] (ecmascript) <export default as LayoutTemplateIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SettingsIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as SettingsIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as PlusIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3Icon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3Icon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as UsersIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayersIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as LayersIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ServerIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/server.js [app-client] (ecmascript) <export default as ServerIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ActivityIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as ActivityIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOutIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOutIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SparklesIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as SparklesIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Sidebar$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Sidebar/styles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$auth$2d$provider$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/providers/auth-provider/index.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function Sidebar(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(89);
    if ($[0] !== "9036d07d760ff4f1b9c63225f6cdebb6e7f3b8f01bb23e1aada3b0351f513259") {
        for(let $i = 0; $i < 89; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9036d07d760ff4f1b9c63225f6cdebb6e7f3b8f01bb23e1aada3b0351f513259";
    }
    const { currentPage, onNavigate } = t0;
    const { styles, cx } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Sidebar$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStyles"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$auth$2d$provider$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthState"])();
    const { logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$auth$2d$provider$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthAction"])();
    let t1;
    if ($[1] !== user?.roleNames) {
        t1 = user?.roleNames?.includes("PlatformAdministrator");
        $[1] = user?.roleNames;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const isAdmin = t1;
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = [
            {
                id: "dashboard",
                label: "Dashboard",
                icon: LayoutGridIcon
            },
            {
                id: "projects",
                label: "My Projects",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderIcon$3e$__["FolderIcon"]
            },
            {
                id: "generate",
                label: "Generate",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SparklesIcon$3e$__["SparklesIcon"]
            },
            {
                id: "templates",
                label: "Templates",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$template$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutTemplateIcon$3e$__["LayoutTemplateIcon"]
            },
            {
                id: "settings",
                label: "Settings",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SettingsIcon$3e$__["SettingsIcon"]
            }
        ];
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    const mainNav = t2;
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = [
            {
                id: "admin",
                label: "Overview",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3Icon$3e$__["BarChart3Icon"]
            },
            {
                id: "admin-users",
                label: "Users",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersIcon$3e$__["UsersIcon"]
            },
            {
                id: "admin-projects",
                label: "Projects",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayersIcon$3e$__["LayersIcon"]
            },
            {
                id: "admin-deployments",
                label: "Deployments",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ServerIcon$3e$__["ServerIcon"]
            },
            {
                id: "admin-health",
                label: "System Health",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ActivityIcon$3e$__["ActivityIcon"]
            }
        ];
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    const adminNav = t3;
    let t4;
    if ($[5] !== logout || $[6] !== router) {
        t4 = ({
            "Sidebar[handleLogout]": async ()=>{
                await logout();
                router.push("/auth");
            }
        })["Sidebar[handleLogout]"];
        $[5] = logout;
        $[6] = router;
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    const handleLogout = t4;
    const t5 = styles.sidebar;
    const t6 = styles.content;
    let t7;
    if ($[8] !== styles.brand) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
            className: styles.brand,
            children: "PromptForge"
        }, void 0, false, {
            fileName: "[project]/src/components/Sidebar/index.tsx",
            lineNumber: 119,
            columnNumber: 10
        }, this);
        $[8] = styles.brand;
        $[9] = t7;
    } else {
        t7 = $[9];
    }
    let t8;
    if ($[10] !== onNavigate) {
        t8 = ({
            "Sidebar[<button>.onClick]": ()=>onNavigate("create")
        })["Sidebar[<button>.onClick]"];
        $[10] = onNavigate;
        $[11] = t8;
    } else {
        t8 = $[11];
    }
    let t9;
    if ($[12] !== cx || $[13] !== styles.focusRing || $[14] !== styles.newButton) {
        t9 = cx(styles.newButton, styles.focusRing);
        $[12] = cx;
        $[13] = styles.focusRing;
        $[14] = styles.newButton;
        $[15] = t9;
    } else {
        t9 = $[15];
    }
    let t10;
    if ($[16] !== styles.newIcon) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusIcon$3e$__["PlusIcon"], {
            className: styles.newIcon
        }, void 0, false, {
            fileName: "[project]/src/components/Sidebar/index.tsx",
            lineNumber: 147,
            columnNumber: 11
        }, this);
        $[16] = styles.newIcon;
        $[17] = t10;
    } else {
        t10 = $[17];
    }
    let t11;
    if ($[18] !== t10 || $[19] !== t8 || $[20] !== t9) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: t8,
            className: t9,
            children: [
                t10,
                "New project"
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Sidebar/index.tsx",
            lineNumber: 155,
            columnNumber: 11
        }, this);
        $[18] = t10;
        $[19] = t8;
        $[20] = t9;
        $[21] = t11;
    } else {
        t11 = $[21];
    }
    const t12 = styles.nav;
    let t13;
    if ($[22] !== currentPage || $[23] !== cx || $[24] !== onNavigate || $[25] !== styles.focusRing || $[26] !== styles.navButton || $[27] !== styles.navButtonActive || $[28] !== styles.navIcon || $[29] !== styles.navIconActive) {
        t13 = mainNav.map({
            "Sidebar[mainNav.map()]": (item)=>{
                const isActive = currentPage === item.id || currentPage === "create" && item.id === "projects";
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: {
                        "Sidebar[mainNav.map() > <button>.onClick]": ()=>onNavigate(item.id === "projects" ? "dashboard" : item.id)
                    }["Sidebar[mainNav.map() > <button>.onClick]"],
                    className: cx(styles.navButton, styles.focusRing, isActive && styles.navButtonActive),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                            className: cx(styles.navIcon, isActive && styles.navIconActive)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.tsx",
                            lineNumber: 171,
                            columnNumber: 144
                        }, this),
                        item.label
                    ]
                }, item.id, true, {
                    fileName: "[project]/src/components/Sidebar/index.tsx",
                    lineNumber: 169,
                    columnNumber: 16
                }, this);
            }
        }["Sidebar[mainNav.map()]"]);
        $[22] = currentPage;
        $[23] = cx;
        $[24] = onNavigate;
        $[25] = styles.focusRing;
        $[26] = styles.navButton;
        $[27] = styles.navButtonActive;
        $[28] = styles.navIcon;
        $[29] = styles.navIconActive;
        $[30] = t13;
    } else {
        t13 = $[30];
    }
    let t14;
    if ($[31] !== styles.nav || $[32] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
            className: t12,
            children: t13
        }, void 0, false, {
            fileName: "[project]/src/components/Sidebar/index.tsx",
            lineNumber: 188,
            columnNumber: 11
        }, this);
        $[31] = styles.nav;
        $[32] = t13;
        $[33] = t14;
    } else {
        t14 = $[33];
    }
    let t15;
    if ($[34] !== currentPage || $[35] !== cx || $[36] !== isAdmin || $[37] !== onNavigate || $[38] !== styles.adminLabel || $[39] !== styles.divider || $[40] !== styles.focusRing || $[41] !== styles.nav || $[42] !== styles.navButton || $[43] !== styles.navButtonActive || $[44] !== styles.navIcon || $[45] !== styles.navIconActive) {
        t15 = isAdmin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: styles.adminLabel,
                    children: "Admin"
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar/index.tsx",
                    lineNumber: 197,
                    columnNumber: 24
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: styles.divider
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar/index.tsx",
                    lineNumber: 197,
                    columnNumber: 70
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: styles.nav,
                    children: adminNav.map({
                        "Sidebar[adminNav.map()]": (item_0)=>{
                            const isActive_0 = currentPage === item_0.id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: {
                                    "Sidebar[adminNav.map() > <button>.onClick]": ()=>onNavigate(item_0.id.startsWith("admin") ? "admin" : item_0.id)
                                }["Sidebar[adminNav.map() > <button>.onClick]"],
                                className: cx(styles.navButton, styles.focusRing, isActive_0 && styles.navButtonActive),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item_0.icon, {
                                        className: cx(styles.navIcon, isActive_0 && styles.navIconActive)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Sidebar/index.tsx",
                                        lineNumber: 202,
                                        columnNumber: 151
                                    }, this),
                                    item_0.label
                                ]
                            }, item_0.id, true, {
                                fileName: "[project]/src/components/Sidebar/index.tsx",
                                lineNumber: 200,
                                columnNumber: 20
                            }, this);
                        }
                    }["Sidebar[adminNav.map()]"])
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar/index.tsx",
                    lineNumber: 197,
                    columnNumber: 104
                }, this)
            ]
        }, void 0, true);
        $[34] = currentPage;
        $[35] = cx;
        $[36] = isAdmin;
        $[37] = onNavigate;
        $[38] = styles.adminLabel;
        $[39] = styles.divider;
        $[40] = styles.focusRing;
        $[41] = styles.nav;
        $[42] = styles.navButton;
        $[43] = styles.navButtonActive;
        $[44] = styles.navIcon;
        $[45] = styles.navIconActive;
        $[46] = t15;
    } else {
        t15 = $[46];
    }
    const t16 = styles.footer;
    let t17;
    if ($[47] !== cx || $[48] !== styles.focusRing || $[49] !== styles.profileButton) {
        t17 = cx(styles.profileButton, styles.focusRing);
        $[47] = cx;
        $[48] = styles.focusRing;
        $[49] = styles.profileButton;
        $[50] = t17;
    } else {
        t17 = $[50];
    }
    let t18;
    if ($[51] !== styles.avatar) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: styles.avatar,
            children: "AC"
        }, void 0, false, {
            fileName: "[project]/src/components/Sidebar/index.tsx",
            lineNumber: 234,
            columnNumber: 11
        }, this);
        $[51] = styles.avatar;
        $[52] = t18;
    } else {
        t18 = $[52];
    }
    let t19;
    if ($[53] !== styles.profileName) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: styles.profileName,
            children: "Alex Chen"
        }, void 0, false, {
            fileName: "[project]/src/components/Sidebar/index.tsx",
            lineNumber: 242,
            columnNumber: 11
        }, this);
        $[53] = styles.profileName;
        $[54] = t19;
    } else {
        t19 = $[54];
    }
    let t20;
    if ($[55] !== styles.profileInfo || $[56] !== t18 || $[57] !== t19) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: styles.profileInfo,
            children: [
                t18,
                t19
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Sidebar/index.tsx",
            lineNumber: 250,
            columnNumber: 11
        }, this);
        $[55] = styles.profileInfo;
        $[56] = t18;
        $[57] = t19;
        $[58] = t20;
    } else {
        t20 = $[58];
    }
    let t21;
    if ($[59] !== styles.chevron) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
            className: styles.chevron
        }, void 0, false, {
            fileName: "[project]/src/components/Sidebar/index.tsx",
            lineNumber: 260,
            columnNumber: 11
        }, this);
        $[59] = styles.chevron;
        $[60] = t21;
    } else {
        t21 = $[60];
    }
    let t22;
    if ($[61] !== t17 || $[62] !== t20 || $[63] !== t21) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            className: t17,
            children: [
                t20,
                t21
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Sidebar/index.tsx",
            lineNumber: 268,
            columnNumber: 11
        }, this);
        $[61] = t17;
        $[62] = t20;
        $[63] = t21;
        $[64] = t22;
    } else {
        t22 = $[64];
    }
    let t23;
    if ($[65] !== cx || $[66] !== styles.focusRing || $[67] !== styles.logoutButton) {
        t23 = cx(styles.logoutButton, styles.focusRing);
        $[65] = cx;
        $[66] = styles.focusRing;
        $[67] = styles.logoutButton;
        $[68] = t23;
    } else {
        t23 = $[68];
    }
    let t24;
    if ($[69] !== styles.logoutIcon) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOutIcon$3e$__["LogOutIcon"], {
            className: styles.logoutIcon
        }, void 0, false, {
            fileName: "[project]/src/components/Sidebar/index.tsx",
            lineNumber: 288,
            columnNumber: 11
        }, this);
        $[69] = styles.logoutIcon;
        $[70] = t24;
    } else {
        t24 = $[70];
    }
    let t25;
    if ($[71] !== handleLogout || $[72] !== t23 || $[73] !== t24) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: handleLogout,
            className: t23,
            children: [
                t24,
                "Log out"
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Sidebar/index.tsx",
            lineNumber: 296,
            columnNumber: 11
        }, this);
        $[71] = handleLogout;
        $[72] = t23;
        $[73] = t24;
        $[74] = t25;
    } else {
        t25 = $[74];
    }
    let t26;
    if ($[75] !== styles.footer || $[76] !== t22 || $[77] !== t25) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t16,
            children: [
                t22,
                t25
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Sidebar/index.tsx",
            lineNumber: 306,
            columnNumber: 11
        }, this);
        $[75] = styles.footer;
        $[76] = t22;
        $[77] = t25;
        $[78] = t26;
    } else {
        t26 = $[78];
    }
    let t27;
    if ($[79] !== styles.content || $[80] !== t11 || $[81] !== t14 || $[82] !== t15 || $[83] !== t26 || $[84] !== t7) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t6,
            children: [
                t7,
                t11,
                t14,
                t15,
                t26
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Sidebar/index.tsx",
            lineNumber: 316,
            columnNumber: 11
        }, this);
        $[79] = styles.content;
        $[80] = t11;
        $[81] = t14;
        $[82] = t15;
        $[83] = t26;
        $[84] = t7;
        $[85] = t27;
    } else {
        t27 = $[85];
    }
    let t28;
    if ($[86] !== styles.sidebar || $[87] !== t27) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t5,
            children: t27
        }, void 0, false, {
            fileName: "[project]/src/components/Sidebar/index.tsx",
            lineNumber: 329,
            columnNumber: 11
        }, this);
        $[86] = styles.sidebar;
        $[87] = t27;
        $[88] = t28;
    } else {
        t28 = $[88];
    }
    return t28;
}
_s(Sidebar, "2tHTiebhE4zcHn0LPnVeysoIVS4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Sidebar$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStyles"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$auth$2d$provider$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$auth$2d$provider$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthAction"]
    ];
});
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(main)/styles/style.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useStyles",
    ()=>useStyles
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2d$style$2f$es$2f$functions$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/antd-style/es/functions/index.js [app-client] (ecmascript) <locals>");
;
const useStyles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$antd$2d$style$2f$es$2f$functions$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStyles"])(({ token, css })=>({
        layout: css`
    --sidebar-width: ${token.paddingXL * 6.5}px;
    min-height: 100vh;
    background: ${token.colorBgLayout};
  `,
        content: css`
    margin-left: var(--sidebar-width, ${token.paddingXL * 6.5}px);
    min-height: 100vh;
  `
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(main)/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MainLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Sidebar$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Sidebar/index.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$main$292f$styles$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(main)/styles/style.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$auth$2d$provider$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/providers/auth-provider/index.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function MainLayout(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(20);
    if ($[0] !== "7bd9fbb30ff519e6846092a12b3f88ec563df32b96b70ad40dd65912c6663836") {
        for(let $i = 0; $i < 20; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7bd9fbb30ff519e6846092a12b3f88ec563df32b96b70ad40dd65912c6663836";
    }
    const { children } = t0;
    const { styles } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$main$292f$styles$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStyles"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { isAuthenticated, isInitialized } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$auth$2d$provider$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthState"])();
    let t1;
    let t2;
    if ($[1] !== isAuthenticated || $[2] !== isInitialized || $[3] !== router) {
        t1 = ({
            "MainLayout[useEffect()]": ()=>{
                if (isInitialized && !isAuthenticated) {
                    router.replace("/auth");
                }
            }
        })["MainLayout[useEffect()]"];
        t2 = [
            isAuthenticated,
            isInitialized,
            router
        ];
        $[1] = isAuthenticated;
        $[2] = isInitialized;
        $[3] = router;
        $[4] = t1;
        $[5] = t2;
    } else {
        t1 = $[4];
        t2 = $[5];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t1, t2);
    if (!isInitialized || !isAuthenticated) {
        return null;
    }
    let t3;
    if ($[6] !== pathname) {
        t3 = pathname.split("/").filter(Boolean);
        $[6] = pathname;
        $[7] = t3;
    } else {
        t3 = $[7];
    }
    const segments = t3;
    const section = segments[0] ?? "dashboard";
    const subSection = segments[1];
    const currentPage = section === "create-project" ? "create" : section === "admin" && subSection ? `admin-${subSection}` : section;
    let t4;
    if ($[8] !== router) {
        t4 = ({
            "MainLayout[handleNavigate]": (page)=>{
                if (page === "create") {
                    router.push("/create-project");
                    return;
                }
                router.push(`/${page}`);
            }
        })["MainLayout[handleNavigate]"];
        $[8] = router;
        $[9] = t4;
    } else {
        t4 = $[9];
    }
    const handleNavigate = t4;
    let t5;
    if ($[10] !== currentPage || $[11] !== handleNavigate) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Sidebar$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"], {
            currentPage: currentPage,
            onNavigate: handleNavigate
        }, void 0, false, {
            fileName: "[project]/src/app/(main)/layout.tsx",
            lineNumber: 84,
            columnNumber: 10
        }, this);
        $[10] = currentPage;
        $[11] = handleNavigate;
        $[12] = t5;
    } else {
        t5 = $[12];
    }
    let t6;
    if ($[13] !== children || $[14] !== styles.content) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: styles.content,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/app/(main)/layout.tsx",
            lineNumber: 93,
            columnNumber: 10
        }, this);
        $[13] = children;
        $[14] = styles.content;
        $[15] = t6;
    } else {
        t6 = $[15];
    }
    let t7;
    if ($[16] !== styles.layout || $[17] !== t5 || $[18] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: styles.layout,
            children: [
                t5,
                t6
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(main)/layout.tsx",
            lineNumber: 102,
            columnNumber: 10
        }, this);
        $[16] = styles.layout;
        $[17] = t5;
        $[18] = t6;
        $[19] = t7;
    } else {
        t7 = $[19];
    }
    return t7;
}
_s(MainLayout, "0uoexDkNf1J49OI6lrIAtZ/c1jM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$main$292f$styles$2f$style$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStyles"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$providers$2f$auth$2d$provider$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthState"]
    ];
});
_c = MainLayout;
var _c;
__turbopack_context__.k.register(_c, "MainLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/shared/src/utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hasA11yProp",
    ()=>hasA11yProp,
    "mergeClasses",
    ()=>mergeClasses,
    "toCamelCase",
    ()=>toCamelCase,
    "toKebabCase",
    ()=>toKebabCase,
    "toPascalCase",
    ()=>toPascalCase
]);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const toKebabCase = (string)=>string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string)=>string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2)=>p2 ? p2.toUpperCase() : p1.toLowerCase());
const toPascalCase = (string)=>{
    const camelCase = toCamelCase(string);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes)=>classes.filter((className, index, array)=>{
        return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
    }).join(" ").trim();
const hasA11yProp = (props)=>{
    for(const prop in props){
        if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
            return true;
        }
    }
};
;
 //# sourceMappingURL=utils.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/defaultAttributes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>defaultAttributes
]);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
};
;
 //# sourceMappingURL=defaultAttributes.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/Icon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Icon
]);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/defaultAttributes.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils.js [app-client] (ecmascript)");
;
;
;
const Icon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])("svg", {
        ref,
        ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])("lucide", className),
        ...!children && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasA11yProp"])(rest) && {
            "aria-hidden": "true"
        },
        ...rest
    }, [
        ...iconNode.map(([tag, attrs])=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(tag, attrs)),
        ...Array.isArray(children) ? children : [
            children
        ]
    ]));
;
 //# sourceMappingURL=Icon.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>createLucideIcon
]);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/Icon.js [app-client] (ecmascript)");
;
;
;
const createLucideIcon = (iconName, iconNode)=>{
    const Component = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            ref,
            iconNode,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])(`lucide-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toKebabCase"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toPascalCase"])(iconName))}`, `lucide-${iconName}`, className),
            ...props
        }));
    Component.displayName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toPascalCase"])(iconName);
    return Component;
};
;
 //# sourceMappingURL=createLucideIcon.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/folder.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Folder
]);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
            key: "1kt360"
        }
    ]
];
const Folder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("folder", __iconNode);
;
 //# sourceMappingURL=folder.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/folder.js [app-client] (ecmascript) <export default as FolderIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FolderIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/layout-template.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>LayoutTemplate
]);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            width: "18",
            height: "7",
            x: "3",
            y: "3",
            rx: "1",
            key: "f1a2em"
        }
    ],
    [
        "rect",
        {
            width: "9",
            height: "7",
            x: "3",
            y: "14",
            rx: "1",
            key: "jqznyg"
        }
    ],
    [
        "rect",
        {
            width: "5",
            height: "7",
            x: "16",
            y: "14",
            rx: "1",
            key: "q5h2i8"
        }
    ]
];
const LayoutTemplate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("layout-template", __iconNode);
;
 //# sourceMappingURL=layout-template.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/layout-template.js [app-client] (ecmascript) <export default as LayoutTemplateIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LayoutTemplateIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$template$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$template$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-template.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Settings
]);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
            key: "1i5ecw"
        }
    ],
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "3",
            key: "1v7zrd"
        }
    ]
];
const Settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("settings", __iconNode);
;
 //# sourceMappingURL=settings.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as SettingsIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SettingsIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Plus
]);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M5 12h14",
            key: "1ays0h"
        }
    ],
    [
        "path",
        {
            d: "M12 5v14",
            key: "s699le"
        }
    ]
];
const Plus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("plus", __iconNode);
;
 //# sourceMappingURL=plus.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as PlusIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PlusIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ChevronDown
]);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m6 9 6 6 6-6",
            key: "qrunsl"
        }
    ]
];
const ChevronDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("chevron-down", __iconNode);
;
 //# sourceMappingURL=chevron-down.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDownIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronDownIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ChartColumn
]);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M3 3v16a2 2 0 0 0 2 2h16",
            key: "c24i48"
        }
    ],
    [
        "path",
        {
            d: "M18 17V9",
            key: "2bz60n"
        }
    ],
    [
        "path",
        {
            d: "M13 17V5",
            key: "1frdt8"
        }
    ],
    [
        "path",
        {
            d: "M8 17v-3",
            key: "17ska0"
        }
    ]
];
const ChartColumn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("chart-column", __iconNode);
;
 //# sourceMappingURL=chart-column.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3Icon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BarChart3Icon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Users
]);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
            key: "1yyitq"
        }
    ],
    [
        "path",
        {
            d: "M16 3.128a4 4 0 0 1 0 7.744",
            key: "16gr8j"
        }
    ],
    [
        "path",
        {
            d: "M22 21v-2a4 4 0 0 0-3-3.87",
            key: "kshegd"
        }
    ],
    [
        "circle",
        {
            cx: "9",
            cy: "7",
            r: "4",
            key: "nufk8"
        }
    ]
];
const Users = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("users", __iconNode);
;
 //# sourceMappingURL=users.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as UsersIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UsersIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Layers
]);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
            key: "zw3jo"
        }
    ],
    [
        "path",
        {
            d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
            key: "1wduqc"
        }
    ],
    [
        "path",
        {
            d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
            key: "kqbvx6"
        }
    ]
];
const Layers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("layers", __iconNode);
;
 //# sourceMappingURL=layers.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as LayersIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LayersIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/server.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Server
]);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            width: "20",
            height: "8",
            x: "2",
            y: "2",
            rx: "2",
            ry: "2",
            key: "ngkwjq"
        }
    ],
    [
        "rect",
        {
            width: "20",
            height: "8",
            x: "2",
            y: "14",
            rx: "2",
            ry: "2",
            key: "iecqi9"
        }
    ],
    [
        "line",
        {
            x1: "6",
            x2: "6.01",
            y1: "6",
            y2: "6",
            key: "16zg32"
        }
    ],
    [
        "line",
        {
            x1: "6",
            x2: "6.01",
            y1: "18",
            y2: "18",
            key: "nzw8ys"
        }
    ]
];
const Server = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("server", __iconNode);
;
 //# sourceMappingURL=server.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/server.js [app-client] (ecmascript) <export default as ServerIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ServerIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/server.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Activity
]);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
            key: "169zse"
        }
    ]
];
const Activity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("activity", __iconNode);
;
 //# sourceMappingURL=activity.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as ActivityIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActivityIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>LogOut
]);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m16 17 5-5-5-5",
            key: "1bji2h"
        }
    ],
    [
        "path",
        {
            d: "M21 12H9",
            key: "dn1m92"
        }
    ],
    [
        "path",
        {
            d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
            key: "1uf3rs"
        }
    ]
];
const LogOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("log-out", __iconNode);
;
 //# sourceMappingURL=log-out.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOutIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LogOutIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Sparkles
]);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
            key: "1s2grr"
        }
    ],
    [
        "path",
        {
            d: "M20 2v4",
            key: "1rf3ol"
        }
    ],
    [
        "path",
        {
            d: "M22 4h-4",
            key: "gwowj6"
        }
    ],
    [
        "circle",
        {
            cx: "4",
            cy: "20",
            r: "2",
            key: "6kqj1y"
        }
    ]
];
const Sparkles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("sparkles", __iconNode);
;
 //# sourceMappingURL=sparkles.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as SparklesIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SparklesIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_fdd6a00d._.js.map