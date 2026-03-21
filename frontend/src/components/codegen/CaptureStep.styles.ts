import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    max-width: ${token.paddingXL * 26}px;
    margin: 0 auto;
  `,
  header: css`
    text-align: center;
    margin-bottom: ${token.marginXL * 1.5}px;
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
  textarea: css`
    width: 100%;
    height: ${token.paddingXL * 7}px;
    padding: ${token.paddingLG}px ${token.paddingXL}px;
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadiusLG * 2}px;
    resize: none;
    font-size: ${token.fontSizeLG}px;
    color: ${token.colorText};
    font-family: ${token.fontFamily};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

    &:focus {
      outline: none;
      border-color: ${token.colorPrimary};
      box-shadow: 0 0 0 3px ${token.colorPrimaryBg}, 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    &:hover:not(:focus) {
      border-color: ${token.colorBorderSecondary};
    }

    &::placeholder {
      color: ${token.colorTextQuaternary};
    }
  `,
  counter: css`
    margin-top: ${token.marginSM}px;
    font-size: ${token.fontSizeSM}px;
    color: ${token.colorTextTertiary};
    text-align: right;
    font-variant-numeric: tabular-nums;
  `,
  counterWarning: css`
    color: ${token.colorWarning};
    font-weight: ${token.fontWeightStrong};
  `,
  actionRow: css`
    display: flex;
    justify-content: flex-end;
    margin-top: ${token.marginXL}px;
  `,
  analyzeButton: css`
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
  resultSection: css`
    margin-top: ${token.marginXL * 2}px;
    padding: ${token.paddingXL * 1.5}px;
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadiusLG * 2}px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
  `,
  resultTitle: css`
    font-size: ${token.fontSizeXL}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorText};
    margin: 0 0 ${token.marginSM}px;
    letter-spacing: -0.01em;
  `,
  resultSubtitle: css`
    font-size: ${token.fontSize}px;
    color: ${token.colorTextSecondary};
    margin: 0 0 ${token.marginXL}px;
    line-height: 1.6;
  `,
  sectionLabel: css`
    font-size: ${token.fontSizeSM}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorTextSecondary};
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: ${token.marginSM}px;
  `,
  tagRow: css`
    display: flex;
    flex-wrap: wrap;
    gap: ${token.marginSM}px;
    margin-bottom: ${token.marginXL}px;
  `,
  entityList: css`
    display: flex;
    flex-wrap: wrap;
    gap: ${token.marginSM}px;
    margin-bottom: ${token.marginXL}px;
  `,
  projectName: css`
    display: flex;
    align-items: center;
    gap: ${token.marginSM}px;
    padding: ${token.paddingSM}px ${token.paddingLG}px;
    background: linear-gradient(135deg, ${token.colorPrimaryBg} 0%, ${token.colorFillQuaternary} 100%);
    border-radius: ${token.borderRadiusLG * 1.5}px;
    font-family: ${token.fontFamilyCode};
    font-size: ${token.fontSize}px;
    color: ${token.colorText};
    margin-bottom: ${token.marginXL}px;
    border: 1px solid ${token.colorPrimaryBorder};
  `,
  addInput: css`
    display: flex;
    gap: ${token.marginSM}px;
    margin-top: ${token.marginSM}px;
  `,
  nextRow: css`
    display: flex;
    justify-content: flex-end;
    margin-top: ${token.marginXL * 1.5}px;
    padding-top: ${token.paddingXL}px;
    border-top: 1px solid ${token.colorBorder};
  `,
  iconSmall: css`
    width: ${token.fontSizeLG}px;
    height: ${token.fontSizeLG}px;
  `,
}));
