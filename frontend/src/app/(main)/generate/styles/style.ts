import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
  page: css`
    max-width: 1200px;
    margin: 0 auto;
    font-family: 'Inter', sans-serif;
  `,
  header: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 32px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  `,
  title: css`
    font-size: 30px;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    background: linear-gradient(to right, #F7931A, #FFD600);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-family: 'Space Grotesk', sans-serif;
  `,
  subtitle: css`
    font-size: 14px;
    color: #94A3B8;
    margin: 0;
    font-family: 'Inter', sans-serif;
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
  content: css`
    display: flex;
    flex-direction: column;
    gap: 32px;
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
  formGroup: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  `,
  label: css`
    font-size: 12px;
    font-weight: 600;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-family: 'Inter', sans-serif;
  `,
  input: css`
    padding: 10px 16px;
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    background: transparent;
    color: #ffffff;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-bottom-color: #F7931A;
      box-shadow: 0 2px 0 0 rgba(247,147,26,0.5);
    }

    &::placeholder {
      color: #94A3B8;
    }
  `,
  textarea: css`
    padding: 10px 16px;
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    background: transparent;
    color: #ffffff;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    min-height: 100px;
    resize: vertical;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-bottom-color: #F7931A;
      box-shadow: 0 2px 0 0 rgba(247,147,26,0.5);
    }

    &::placeholder {
      color: #94A3B8;
    }
  `,
  select: css`
    padding: 10px 16px;
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    background: transparent;
    color: #ffffff;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-bottom-color: #F7931A;
      box-shadow: 0 2px 0 0 rgba(247,147,26,0.5);
    }
  `,
  checkbox: css`
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #ffffff;
  `,
  checkboxInput: css`
    width: 20px;
    height: 20px;
    border: 1px solid rgba(255,255,255,0.1);
    background: transparent;
    cursor: pointer;
    accent-color: #F7931A;
    border-radius: 4px;
  `,
  grid: css`
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 16px;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  `,
  focusRing: css`
    &:focus-visible {
      outline: 2px solid #F7931A;
      outline-offset: 2px;
    }
  `,
}));