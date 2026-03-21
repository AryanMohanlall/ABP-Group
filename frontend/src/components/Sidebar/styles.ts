import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
  sidebar: css`
    width: 256px;
    height: 100vh;
    background: rgba(15, 17, 21, 0.8);
    backdrop-filter: blur(16px);
    color: #ffffff;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    position: fixed;
    left: 0;
    top: 0;
    border-right: 1px solid rgba(255,255,255,0.1);
    font-family: 'Inter', sans-serif;
    z-index: 50;
  `,
  content: css`
    padding: 24px;
    display: flex;
    flex-direction: column;
    height: 100%;
  `,
  brand: css`
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 32px;
    background: linear-gradient(to right, #F7931A, #FFD600);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-family: 'Space Grotesk', sans-serif;
    letter-spacing: -0.02em;
  `,
  newButton: css`
    width: 100%;
    border: none;
    background: linear-gradient(to right, #EA580C, #F7931A);
    color: #ffffff;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 32px;
    border-radius: 9999px;
    box-shadow: 0 0 20px -5px rgba(247,147,26,0.4);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 0 30px -5px rgba(247,147,26,0.6);
    }

    &:active {
      transform: translateY(0);
    }
  `,
  newIcon: css`
    width: 20px;
    height: 20px;
    margin-right: 8px;
  `,
  nav: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,
  navButton: css`
    width: 100%;
    display: flex;
    align-items: center;
    padding: 10px 16px;
    border: 1px solid transparent;
    background: transparent;
    color: #94A3B8;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: 12px;

    &:hover {
      background: rgba(255,255,255,0.05);
      color: #ffffff;
      border-color: rgba(255,255,255,0.1);
    }
  `,
  navButtonActive: css`
    background: rgba(247,147,26,0.1);
    color: #F7931A;
    border-color: rgba(247,147,26,0.3);
    box-shadow: 0 0 20px -5px rgba(247,147,26,0.3);

    &:hover {
      background: rgba(247,147,26,0.15);
      color: #F7931A;
      border-color: rgba(247,147,26,0.4);
    }
  `,
  navIcon: css`
    width: 20px;
    height: 20px;
    margin-right: 12px;
  `,
  navIconActive: css`
    color: #F7931A;
  `,
  adminLabel: css`
    margin: 32px 8px 8px;
    font-size: 12px;
    font-weight: 600;
    color: #94A3B8;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-family: 'Inter', sans-serif;
  `,
  divider: css`
    height: 1px;
    background: rgba(255,255,255,0.1);
    margin: 0 8px 8px;
  `,
  footer: css`
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid rgba(255,255,255,0.1);
  `,
  profileCard: css`
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(16px);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: rgba(247,147,26,0.3);
      box-shadow: 0 0 20px -5px rgba(247,147,26,0.2);
    }
  `,
  logoutButton: css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 8px;
    padding: 10px 16px;
    border: 1px solid rgba(239,68,68,0.3);
    background: rgba(239,68,68,0.1);
    color: #EF4444;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 12px;

    &:hover {
      background: rgba(239,68,68,0.2);
      border-color: rgba(239,68,68,0.5);
      box-shadow: 0 0 20px -5px rgba(239,68,68,0.3);
    }

    &:active {
      transform: scale(0.98);
    }
  `,
  logoutIcon: css`
    width: 16px;
    height: 16px;
    color: currentColor;
  `,
  profileInfo: css`
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    width: 100%;
  `,
  avatar: css`
    width: 40px;
    height: 40px;
    border: 1px solid rgba(247,147,26,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: #F7931A;
    font-family: 'Inter', sans-serif;
    background: rgba(247,147,26,0.1);
    border-radius: 12px;
  `,
  profileName: css`
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
  `,
  profileTextBlock: css`
    display: flex;
    flex-direction: column;
    min-width: 0;
    gap: 4px;
    flex: 1;
  `,
  profileMeta: css`
    font-size: 14px;
    color: #94A3B8;
    line-height: 1.25;
    max-width: 100%;
    white-space: normal;
    word-break: break-word;
  `,
  roleBadge: css`
    display: inline-flex;
    width: fit-content;
    max-width: 100%;
    margin-top: 4px;
    padding: 4px 8px;
    border: 1px solid rgba(247,147,26,0.3);
    color: #F7931A;
    font-size: 12px;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    background: rgba(247,147,26,0.1);
    border-radius: 8px;
  `,
  focusRing: css`
    &:focus-visible {
      outline: 2px solid #F7931A;
      outline-offset: 2px;
    }
  `,
}));