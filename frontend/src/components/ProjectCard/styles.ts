import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
  card: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(15, 17, 21, 0.8);
    backdrop-filter: blur(16px);
    font-family: 'Inter', sans-serif;
    height: 100%;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 0 50px -10px rgba(247,147,26,0.1);

    &:hover {
      transform: translateY(-4px);
      border-color: rgba(247,147,26,0.3);
      box-shadow: 0 0 30px -5px rgba(247,147,26,0.3);
    }
  `,
  header: css`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px;
    background: linear-gradient(135deg, #EA580C, #F7931A);
    color: #ffffff;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 14px;
  `,
  title: css`
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: 'Space Grotesk', sans-serif;
  `,
  meta: css`
    font-size: 12px;
    color: rgba(255,255,255,0.8);
    margin: 4px 0 0;
    opacity: 0.9;
  `,
  statusBadge: css`
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: 1px solid rgba(255,255,255,0.3);
    font-family: 'Inter', sans-serif;
    border-radius: 8px;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(8px);
  `,
  statusDraft: css`
    color: #ffffff;
    border-color: rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.1);
  `,
  statusGenerating: css`
    color: #FFD600;
    border-color: rgba(255,214,0,0.5);
    background: rgba(255,214,0,0.1);
  `,
  statusGenerated: css`
    color: #F7931A;
    border-color: rgba(247,147,26,0.5);
    background: rgba(247,147,26,0.1);
  `,
  statusDeploying: css`
    color: #FFD600;
    border-color: rgba(255,214,0,0.5);
    background: rgba(255,214,0,0.1);
  `,
  statusLive: css`
    color: #22C55E;
    border-color: rgba(34,197,94,0.5);
    background: rgba(34,197,94,0.1);
  `,
  statusFailed: css`
    color: #EF4444;
    border-color: rgba(239,68,68,0.5);
    background: rgba(239,68,68,0.1);
  `,
  body: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px;
  `,
  updatedAt: css`
    font-size: 14px;
    color: #94A3B8;
    margin: 0;
  `,
  url: css`
    font-size: 14px;
    color: #F7931A;
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      color: #FFD600;
      text-shadow: 0 0 10px rgba(247,147,26,0.5);
    }
  `,
  urlMuted: css`
    font-size: 14px;
    color: #94A3B8;
  `,
  footer: css`
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 20px;
    border-top: 1px solid rgba(255,255,255,0.1);
  `,
  footerActions: css`
    display: flex;
    align-items: center;
    gap: 12px;
  `,
  deleteButton: css`
    padding: 8px 16px;
    border: 1px solid rgba(239,68,68,0.3);
    background: rgba(239,68,68,0.1);
    color: #EF4444;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 12px;

    &:hover:not(:disabled) {
      background: rgba(239,68,68,0.2);
      border-color: rgba(239,68,68,0.5);
      box-shadow: 0 0 20px -5px rgba(239,68,68,0.3);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `,
  viewButton: css`
    padding: 8px 16px;
    border: none;
    background: linear-gradient(to right, #EA580C, #F7931A);
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 12px;
    box-shadow: 0 0 20px -5px rgba(247,147,26,0.4);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 0 30px -5px rgba(247,147,26,0.6);
    }

    &:active {
      transform: translateY(0);
    }
  `,
  claimButton: css`
    padding: 8px 16px;
    border: 1px solid rgba(247,147,26,0.3);
    background: rgba(247,147,26,0.1);
    color: #F7931A;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 12px;

    &:hover {
      background: rgba(247,147,26,0.2);
      border-color: rgba(247,147,26,0.5);
      box-shadow: 0 0 20px -5px rgba(247,147,26,0.3);
    }

    &:active {
      transform: scale(0.98);
    }
  `,
  details: css`
    font-size: 14px;
    color: #94A3B8;
  `,
  focusRing: css`
    &:focus-visible {
      outline: 2px solid #F7931A;
      outline-offset: 2px;
    }
  `,
}));