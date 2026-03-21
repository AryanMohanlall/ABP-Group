import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    max-width: ${token.paddingXL * 30}px;
    margin: 0 auto;
  `,
  header: css`
    background: ${token.colorBgContainer};
    border-radius: ${token.borderRadiusLG * 2}px;
    border: 1px solid ${token.colorBorder};
    padding: ${token.paddingXL * 1.5}px;
    margin-bottom: ${token.marginXL * 1.5}px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
  `,
  titleRow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${token.marginXL}px;
  `,
  title: css`
    font-size: ${token.fontSizeXL * 1.2}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorText};
    margin: 0;
    letter-spacing: -0.02em;
  `,
  statusBadge: css`
    display: inline-flex;
    align-items: center;
    padding: ${token.paddingSM / 2}px ${token.padding}px;
    border-radius: ${token.borderRadiusLG * 2}px;
    font-size: ${token.fontSizeSM}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorWarning};
    background: linear-gradient(135deg, ${token.colorWarningBg} 0%, rgba(255, 255, 255, 0.8) 100%);
    border: 1px solid ${token.colorWarningBorder};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  `,
  statusComplete: css`
    color: ${token.colorSuccess};
    background: linear-gradient(135deg, ${token.colorSuccessBg} 0%, rgba(255, 255, 255, 0.8) 100%);
    border-color: ${token.colorSuccessBorder};
  `,
  statusFailed: css`
    color: ${token.colorError};
    background: linear-gradient(135deg, ${token.colorErrorBg} 0%, rgba(255, 255, 255, 0.8) 100%);
    border-color: ${token.colorErrorBorder};
  `,
  progressWrap: css`
    display: flex;
    flex-direction: column;
    gap: ${token.marginSM}px;
  `,
  progressTrack: css`
    position: relative;
    height: ${token.controlHeightSM / 1.5}px;
    border-radius: ${token.borderRadiusLG * 1.5}px;
    background: ${token.colorFillSecondary};
    overflow: hidden;
  `,
  progressFill: css`
    height: 100%;
    border-radius: ${token.borderRadiusLG * 1.5}px;
    background: linear-gradient(90deg, ${token.colorPrimary} 0%, ${token.colorSuccess} 100%);
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  `,
  progressShimmer: css`
    position: absolute;
    inset: 0;
    background: linear-gradient(
      120deg,
      transparent 0%,
      ${token.colorFillQuaternary} 50%,
      transparent 100%
    );
    animation: shimmer 2s infinite;

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `,
  progressMeta: css`
    display: flex;
    justify-content: space-between;
    font-size: ${token.fontSizeSM}px;
    color: ${token.colorTextSecondary};
    font-variant-numeric: tabular-nums;
  `,
  grid: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${token.marginXL}px;

    @media (min-width: ${token.screenLG}px) {
      grid-template-columns: 1fr 1fr;
    }
  `,
  card: css`
    background: ${token.colorBgContainer};
    border-radius: ${token.borderRadiusLG * 2}px;
    border: 1px solid ${token.colorBorder};
    padding: ${token.paddingXL * 1.25}px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  `,
  cardTitle: css`
    font-size: ${token.fontSizeLG}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorText};
    margin: 0 0 ${token.marginLG}px;
    letter-spacing: -0.01em;
  `,
  validationStack: css`
    display: flex;
    flex-direction: column;
    gap: ${token.marginSM}px;
  `,
  validationItem: css`
    display: flex;
    align-items: center;
    gap: ${token.marginSM}px;
    padding: ${token.paddingSM}px ${token.paddingLG}px;
    border-radius: ${token.borderRadiusLG * 1.5}px;
    background: ${token.colorFillQuaternary};
    transition: background 0.2s ease;

    &:hover {
      background: ${token.colorFillSecondary};
    }
  `,
  validationPending: css`
    color: ${token.colorTextTertiary};
  `,
  validationRunning: css`
    color: ${token.colorPrimary};
    animation: spin 1s linear infinite;

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  validationPassed: css`
    color: ${token.colorSuccess};
  `,
  validationFailed: css`
    color: ${token.colorError};
  `,
  validationText: css`
    flex: 1;
    font-size: ${token.fontSizeSM}px;
    color: ${token.colorTextSecondary};
    line-height: 1.4;
  `,
  activityFeed: css`
    display: flex;
    flex-direction: column;
    gap: ${token.marginSM / 2}px;
    max-height: 400px;
    overflow-y: auto;
    padding: ${token.paddingLG}px;
    background: ${token.colorFillQuaternary};
    border-radius: ${token.borderRadiusLG * 1.5}px;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${token.colorBorder};
      border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
  `,
  activityItem: css`
    display: flex;
    align-items: center;
    gap: ${token.marginSM}px;
    padding: ${token.paddingSM / 2}px ${token.paddingSM}px;
    font-size: ${token.fontSizeSM}px;
    border-radius: ${token.borderRadiusLG}px;
    transition: background 0.2s ease;

    &:hover {
      background: ${token.colorFillSecondary};
    }
  `,
  activityDot: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${token.colorSuccess};
    flex-shrink: 0;
    box-shadow: 0 0 0 3px ${token.colorSuccessBg};
  `,
  activityDotActive: css`
    background: ${token.colorPrimary};
    box-shadow: 0 0 0 3px ${token.colorPrimaryBg};
    animation: pulse 2s infinite;

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
  `,
  activityText: css`
    color: ${token.colorTextSecondary};
    line-height: 1.4;
  `,
  iconSmall: css`
    width: ${token.fontSizeLG}px;
    height: ${token.fontSizeLG}px;
  `,
}));
