import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    max-width: ${token.paddingXL * 30}px;
    margin: 0 auto;
  `,
  successCard: css`
    position: relative;
    overflow: hidden;
    border-radius: ${token.borderRadiusLG * 2}px;
    padding: ${token.paddingXL * 2}px;
    background: linear-gradient(135deg, ${token.colorSuccess} 0%, ${token.colorPrimary} 100%);
    color: ${token.colorBgContainer};
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08);
  `,
  successOverlay: css`
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at top right,
      ${token.colorFillSecondary} 0%,
      transparent 55%
    );
    opacity: 0.4;
  `,
  successContent: css`
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: ${token.marginXL}px;
  `,
  successIcon: css`
    width: ${token.controlHeightLG * 1.6}px;
    height: ${token.controlHeightLG * 1.6}px;
    border-radius: 50%;
    background: ${token.colorBgContainer};
    color: ${token.colorSuccess};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `,
  successTitle: css`
    margin: 0;
    font-size: ${token.fontSizeXL * 1.3}px;
    font-weight: ${token.fontWeightStrong};
    letter-spacing: -0.02em;
  `,
  successSubtitle: css`
    margin: 0;
    font-size: ${token.fontSizeLG}px;
    opacity: 0.9;
    line-height: 1.6;
  `,
  successActions: css`
    display: flex;
    flex-wrap: wrap;
    gap: ${token.marginSM}px;
    justify-content: center;
  `,
  primaryButton: css`
    display: inline-flex;
    align-items: center;
    gap: ${token.marginSM}px;
    padding: ${token.paddingSM * 1.5}px ${token.paddingXL}px;
    border-radius: ${token.borderRadiusLG * 2}px;
    border: none;
    background: ${token.colorBgContainer};
    color: ${token.colorSuccess};
    font-weight: ${token.fontWeightStrong};
    font-size: ${token.fontSize}px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }
  `,
  ghostButton: css`
    display: inline-flex;
    align-items: center;
    gap: ${token.marginSM}px;
    padding: ${token.paddingSM * 1.5}px ${token.paddingXL}px;
    border-radius: ${token.borderRadiusLG * 2}px;
    border: 1px solid ${token.colorBgContainer};
    background: transparent;
    color: ${token.colorBgContainer};
    font-weight: ${token.fontWeightStrong};
    font-size: ${token.fontSize}px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  `,
  failedCard: css`
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorErrorBorder};
    border-radius: ${token.borderRadiusLG * 2}px;
    padding: ${token.paddingXL * 1.5}px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
  `,
  failedHeader: css`
    display: flex;
    align-items: center;
    gap: ${token.marginLG}px;
    margin-bottom: ${token.marginXL}px;
  `,
  failedIcon: css`
    width: ${token.controlHeightLG * 1.2}px;
    height: ${token.controlHeightLG * 1.2}px;
    border-radius: 50%;
    background: ${token.colorErrorBg};
    color: ${token.colorError};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  `,
  failedTitle: css`
    font-size: ${token.fontSizeLG}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorText};
    margin: 0;
    letter-spacing: -0.01em;
  `,
  failedSubtitle: css`
    font-size: ${token.fontSize}px;
    color: ${token.colorTextSecondary};
    margin: 0;
    line-height: 1.5;
  `,
  failureList: css`
    display: flex;
    flex-direction: column;
    gap: ${token.marginSM}px;
    margin-bottom: ${token.marginXL}px;
  `,
  failureItem: css`
    display: flex;
    align-items: center;
    gap: ${token.marginSM}px;
    padding: ${token.paddingSM}px ${token.paddingLG}px;
    background: ${token.colorErrorBg};
    border-radius: ${token.borderRadiusLG * 1.5}px;
    font-size: ${token.fontSizeSM}px;
    color: ${token.colorError};
    line-height: 1.4;
  `,
  failedActions: css`
    display: flex;
    gap: ${token.marginSM}px;
  `,
  repairButton: css`
    display: inline-flex;
    align-items: center;
    gap: ${token.marginSM}px;
    padding: ${token.paddingSM * 1.75}px ${token.paddingXL * 1.25}px;
    border-radius: ${token.borderRadiusLG * 2}px;
    border: none;
    background: linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryHover} 100%);
    color: ${token.colorBgContainer};
    font-weight: ${token.fontWeightStrong};
    font-size: ${token.fontSize}px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  secondaryButton: css`
    display: inline-flex;
    align-items: center;
    gap: ${token.marginSM}px;
    padding: ${token.paddingSM * 1.75}px ${token.paddingXL * 1.25}px;
    border-radius: ${token.borderRadiusLG * 2}px;
    border: 1px solid ${token.colorBorder};
    background: ${token.colorBgContainer};
    color: ${token.colorText};
    font-weight: ${token.fontWeightStrong};
    font-size: ${token.fontSize}px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: ${token.colorBorderSecondary};
      background: ${token.colorFillQuaternary};
    }
  `,
  iconSmall: css`
    width: ${token.fontSizeLG}px;
    height: ${token.fontSizeLG}px;
  `,
  iconLarge: css`
    width: ${token.fontSizeXL * 1.2}px;
    height: ${token.fontSizeXL * 1.2}px;
  `,
}));
