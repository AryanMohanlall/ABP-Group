import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    max-width: ${token.paddingXL * 34}px;
    margin: 0 auto;
  `,
  header: css`
    text-align: center;
    margin-bottom: ${token.marginXL * 1.5}px;
  `,
  headerIcon: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: ${token.borderRadiusLG * 2}px;
    background: linear-gradient(135deg, ${token.colorPrimaryBg} 0%, ${token.colorBgContainer} 100%);
    color: ${token.colorPrimary};
    margin-bottom: ${token.marginLG}px;
  `,
  title: css`
    font-size: ${token.fontSizeXL * 1.4}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorText};
    margin: 0 0 ${token.marginSM}px;
    letter-spacing: -0.02em;
  `,
  subtitle: css`
    color: ${token.colorTextSecondary};
    margin: 0;
    line-height: 1.7;
    font-size: ${token.fontSizeLG}px;
  `,
  loadingWrap: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${token.paddingXL * 4}px;
    gap: ${token.marginXL}px;
  `,
  loadingText: css`
    color: ${token.colorTextSecondary};
    font-size: ${token.fontSizeLG}px;
  `,
  summaryCard: css`
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadiusLG * 2}px;
    padding: ${token.paddingLG}px ${token.paddingXL}px;
    margin-bottom: ${token.marginLG}px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  `,
  summaryTitle: css`
    font-size: ${token.fontSizeLG}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorText};
    margin: 0 0 ${token.marginSM}px;
  `,
  summaryText: css`
    color: ${token.colorTextSecondary};
    line-height: 1.7;
    margin: 0;
  `,
  readmeCard: css`
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadiusLG * 2}px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    margin-bottom: ${token.marginLG}px;
  `,
  readmeHeader: css`
    display: flex;
    align-items: center;
    gap: ${token.marginSM}px;
    padding: ${token.paddingLG}px ${token.paddingXL}px;
    border-bottom: 1px solid ${token.colorBorder};
    background: ${token.colorFillQuaternary};
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorText};
  `,
  readmeContent: css`
    padding: ${token.paddingXL}px;
    max-height: 600px;
    overflow-y: auto;
  `,
  readmePre: css`
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: ${token.fontFamilyCode};
    font-size: ${token.fontSize}px;
    line-height: 1.7;
    color: ${token.colorText};
    margin: 0;
  `,
  actionRow: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${token.marginXL * 1.5}px;
    padding-top: ${token.paddingXL}px;
    border-top: 1px solid ${token.colorBorder};
  `,
  backButton: css`
    display: inline-flex;
    align-items: center;
    gap: ${token.marginSM}px;
    padding: ${token.paddingSM}px 0;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorTextSecondary};
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.2s ease;
    font-size: ${token.fontSize}px;

    &:hover {
      color: ${token.colorText};
    }
  `,
  confirmButton: css`
    display: inline-flex;
    align-items: center;
    gap: ${token.marginSM}px;
    padding: ${token.paddingSM * 1.75}px ${token.paddingXL * 1.25}px;
    border-radius: ${token.borderRadiusLG * 2}px;
    border: none;
    background: linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryHover} 100%);
    color: ${token.colorBgContainer};
    font-weight: ${token.fontWeightStrong};
    font-size: ${token.fontSizeLG}px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
    letter-spacing: 0.01em;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16), 0 2px 4px rgba(0, 0, 0, 0.08);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
}));