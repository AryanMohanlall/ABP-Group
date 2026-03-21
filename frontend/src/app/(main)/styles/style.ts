import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
  layout: css`
    --sidebar-width: 256px;
    min-height: 100vh;
    background: #030304;
    font-family: 'Inter', sans-serif;
  `,
  content: css`
    margin-left: var(--sidebar-width, 256px);
    min-height: 100vh;
    padding: 32px;
    background: #030304;
    color: #ffffff;
  `,
}));