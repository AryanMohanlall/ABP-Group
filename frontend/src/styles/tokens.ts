// Premium Crypto Design System Tokens
// High-trust, high-value visual language - "Data is money" energy

export const colors = {
  // Core palette - PRIMARY VOID as main background
  bg: "#030304",          // true void - PRIMARY background
  surface: "#0F1115",     // cards / panels
  
  text: "#FFFFFF",
  textMuted: "#94A3B8",
  
  border: "#1E293B",
  
  // Brand colors - ACCENT ONLY
  primary: "#F7931A",     // bitcoin orange - ACCENT ONLY
  secondary: "#EA580C",   // burnt orange - ACCENT ONLY
  tertiary: "#FFD600",    // digital gold - ACCENT ONLY
  
  // Semantic colors
  error: "#EF4444",
  success: "#22C55E",
  warning: "#F59E0B",
  
  // Utility
  white: "#ffffff",
  black: "#000000",
} as const;

export const gradients = {
  primary: "linear-gradient(to right, #EA580C, #F7931A)",
  gold: "linear-gradient(to right, #F7931A, #FFD600)",
  text: "linear-gradient(to right, #F7931A, #FFD600)",
} as const;

export const typography = {
  fontHeading: "'Space Grotesk', sans-serif",
  fontBody: "'Inter', sans-serif",
  fontMono: "'JetBrains Mono', monospace",
  
  scale: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
    "5xl": "48px",
    "6xl": "60px",
    "7xl": "72px",
  },
  
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  styles: {
    heading: "font-heading font-semibold leading-tight",
    body: "font-body leading-relaxed",
    mono: "font-mono tracking-wider",
  },
} as const;

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
  "3xl": "48px",
  "4xl": "64px",
  "5xl": "80px",
  "6xl": "96px",
} as const;

export const radius = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  pill: "9999px",
} as const;

export const borders = {
  subtle: "1px solid rgba(255,255,255,0.1)",
  hover: "1px solid rgba(247,147,26,0.5)",
  active: "1px solid #F7931A",
  width: "1px",
  style: "solid",
  color: colors.border,
} as const;

export const shadows = {
  glowOrange: "0 0 30px -5px rgba(247,147,26,0.6)",
  glowSoft: "0 0 20px -5px rgba(234,88,12,0.5)",
  glowGold: "0 0 20px rgba(255,214,0,0.3)",
  card: "0 0 50px -10px rgba(247,147,26,0.1)",
  button: "0 0 20px -5px rgba(247,147,26,0.4)",
} as const;

export const effects = {
  glass: "backdrop-blur-lg bg-white/5",
  glassDark: "backdrop-blur-lg bg-black/40",
  
  gridPattern: `
    linear-gradient(to right, rgba(30,41,59,0.5) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(30,41,59,0.5) 1px, transparent 1px)
  `,
} as const;

export const animations = {
  float: `
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `,
  spin: `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  ping: `
    @keyframes ping {
      75%, 100% { transform: scale(2); opacity: 0; }
    }
  `,
  pulse: `
    @keyframes pulse {
      50% { opacity: .5; }
    }
  `,
  glow: `
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px -5px rgba(247,147,26,0.4); }
      50% { box-shadow: 0 0 30px -5px rgba(247,147,26,0.6); }
    }
  `,
} as const;

// Combined token export
export const tokens = {
  colors,
  gradients,
  typography,
  spacing,
  radius,
  borders,
  shadows,
  effects,
  animations,
} as const;

export default tokens;