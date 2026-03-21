import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    max-width: ${token.paddingXL * 30}px;
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
  selectionSection: css`
    display: flex;
    flex-direction: column;
    gap: ${token.marginXL * 1.5}px;
    margin-bottom: ${token.marginXL * 1.5}px;
  `,
  sectionLabel: css`
    font-size: ${token.fontSizeSM}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorTextSecondary};
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: ${token.marginSM}px;
  `,
  selectionGrid: css`
    display: flex;
    flex-wrap: wrap;
    gap: ${token.marginSM}px;
  `,
  selectionCard: css`
    position: relative;
    width: ${token.paddingXL * 5}px;
    min-height: ${token.paddingXL * 2.8}px;
    border-radius: ${token.borderRadiusLG * 2}px;
    border: 1px solid ${token.colorBorder};
    padding: ${token.paddingSM}px ${token.paddingLG}px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${token.marginSM / 2}px;
    font-size: ${token.fontSizeSM}px;
    font-weight: ${token.fontWeightStrong};
    background: ${token.colorBgContainer};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
  `,
  selectionCardSelected: css`
    border-color: ${token.colorPrimary};
    color: ${token.colorPrimary};
    background: linear-gradient(135deg, ${token.colorPrimaryBg} 0%, rgba(255, 255, 255, 0.8) 100%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 0 0 2px ${token.colorPrimaryBg};
  `,
  selectionCardDefault: css`
    color: ${token.colorText};

    &:hover {
      border-color: ${token.colorBorderSecondary};
      background: ${token.colorBgContainer};
    }
  `,
  selectionCheck: css`
    position: absolute;
    top: ${token.paddingSM / 2}px;
    right: ${token.paddingSM / 2}px;
    color: ${token.colorPrimary};
  `,
  recommendedBadge: css`
    position: absolute;
    top: -${token.marginSM}px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorPrimary};
    background: linear-gradient(135deg, ${token.colorPrimaryBg} 0%, rgba(255, 255, 255, 0.9) 100%);
    border: 1px solid ${token.colorPrimaryBorder};
    padding: 2px 10px;
    border-radius: ${token.borderRadiusLG * 1.5}px;
    white-space: nowrap;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  `,
  reasoning: css`
    font-size: ${token.fontSizeSM * 0.9}px;
    color: ${token.colorTextTertiary};
    font-weight: normal;
    text-align: center;
    margin-top: 2px;
    line-height: 1.4;
  `,
  selectionLabel: css`
    text-align: center;
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
  nextButton: css`
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
  iconSmall: css`
    width: ${token.fontSizeLG}px;
    height: ${token.fontSizeLG}px;
  `,
  templateSection: css`
    margin-bottom: ${token.marginXL}px;
  `,
  templateHint: css`
    font-size: ${token.fontSize}px;
    color: ${token.colorTextSecondary};
    margin: 0 0 ${token.marginSM}px;
    line-height: 1.5;
  `,
  templateGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: ${token.marginSM}px;
  `,
  templateCard: css`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${token.marginSM}px;
    padding: ${token.paddingXL}px ${token.paddingSM}px;
    border-radius: ${token.borderRadiusLG * 2}px;
    border: 1px solid ${token.colorBorder};
    background: ${token.colorBgContainer};
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: center;
    min-height: ${token.paddingXL * 4.5}px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    }
  `,
  templateCardSelected: css`
    border-color: ${token.colorPrimary};
    background: linear-gradient(135deg, ${token.colorPrimaryBg} 0%, rgba(255, 255, 255, 0.8) 100%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 0 0 2px ${token.colorPrimaryBg};
  `,
  templateCardDefault: css`
    &:hover {
      border-color: ${token.colorBorderSecondary};
      background: ${token.colorBgContainer};
    }
  `,
  templateCardIcon: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: ${token.borderRadiusLG * 1.5}px;
    background: linear-gradient(135deg, ${token.colorBgLayout} 0%, ${token.colorFillQuaternary} 100%);
    color: ${token.colorPrimary};
  `,
  templateCardName: css`
    font-size: ${token.fontSizeSM}px;
    font-weight: ${token.fontWeightStrong};
    color: ${token.colorText};
  `,
  templateCardDesc: css`
    font-size: ${token.fontSizeSM * 0.9}px;
    color: ${token.colorTextSecondary};
    line-height: 1.4;
  `,
  focusRing: css`
    &:focus-visible {
      outline: 2px solid ${token.colorPrimary};
      outline-offset: 2px;
    }
  `,
  divider: css`
    height: 1px;
    width: 100%;
    background: linear-gradient(90deg, transparent 0%, ${token.colorBorder} 50%, transparent 100%);
    margin: ${token.marginXL * 1.5}px 0;
  `,
}));
