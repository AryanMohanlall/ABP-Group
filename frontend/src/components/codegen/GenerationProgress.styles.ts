import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    gap: 32px;
    font-family: 'Inter', sans-serif;
  `,
  section: css`
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(15, 17, 21, 0.8);
    backdrop-filter: blur(16px);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 0 50px -10px rgba(247,147,26,0.1);
  `,
  sectionHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    background: linear-gradient(135deg, #EA580C, #F7931A);
    color: #ffffff;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 14px;
  `,
  sectionTitle: css`
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
  `,
  sectionBody: css`
    padding: 20px;
  `,
  progressContainer: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
  progressBar: css`
    display: flex;
    align-items: center;
    gap: 12px;
  `,
  progressFill: css`
    flex: 1;
    height: 8px;
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
    overflow: hidden;
  `,
  progressFillInner: css`
    height: 100%;
    background: linear-gradient(to right, #EA580C, #F7931A);
    border-radius: 4px;
    transition: width 0.3s ease;
  `,
  progressText: css`
    font-size: 14px;
    font-weight: 600;
    color: #F7931A;
    min-width: 40px;
    text-align: right;
    font-family: 'Inter', sans-serif;
  `,
  statusText: css`
    font-size: 14px;
    color: #94A3B8;
    font-family: 'Inter', sans-serif;
  `,
  steps: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,
  step: css`
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
  `,
  stepDone: css`
    color: #22C55E;
  `,
  stepRunning: css`
    color: #FFD600;
  `,
  stepPending: css`
    color: #94A3B8;
  `,
  stepLabel: css`
    flex: 1;
  `,
  actions: css`
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  `,
  actionButton: css`
    padding: 10px 20px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(15, 17, 21, 0.8);
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 12px;
    backdrop-filter: blur(16px);

    &:hover {
      background: rgba(255,255,255,0.05);
      border-color: rgba(247,147,26,0.5);
      box-shadow: 0 0 20px -5px rgba(247,147,26,0.3);
    }
  `,
  primaryAction: css`
    padding: 10px 20px;
    border: none;
    background: linear-gradient(to right, #EA580C, #F7931A);
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 9999px;
    box-shadow: 0 0 20px -5px rgba(247,147,26,0.4);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 0 30px -5px rgba(247,147,26,0.6);
    }
  `,
  focusRing: css`
    &:focus-visible {
      outline: 2px solid #F7931A;
      outline-offset: 2px;
    }
  `,
}));