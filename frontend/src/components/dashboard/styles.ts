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
  actions: css`
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  `,
  searchWrap: css`
    position: relative;
  `,
  searchIcon: css`
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: #94A3B8;
  `,
  searchInput: css`
    padding: 10px 16px;
    padding-left: 40px;
    background: rgba(15, 17, 21, 0.8);
    border: 1px solid rgba(255,255,255,0.1);
    font-size: 14px;
    color: #ffffff;
    width: 200px;
    font-family: 'Inter', sans-serif;
    border-radius: 12px;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: rgba(247,147,26,0.5);
      box-shadow: 0 0 20px -5px rgba(247,147,26,0.3);
    }

    &::placeholder {
      color: #94A3B8;
    }
  `,
  filterWrap: css`
    position: relative;
  `,
  filterButton: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: rgba(15, 17, 21, 0.8);
    border: 1px solid rgba(255,255,255,0.1);
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    cursor: pointer;
    min-width: 150px;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.2s ease;
    border-radius: 12px;

    &:hover {
      background: rgba(255,255,255,0.05);
      border-color: rgba(247,147,26,0.3);
    }
  `,
  filterIcon: css`
    width: 16px;
    height: 16px;
    color: #94A3B8;
  `,
  filterMenu: css`
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    width: 180px;
    background: rgba(15, 17, 21, 0.95);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    overflow: hidden;
    z-index: 20;
    backdrop-filter: blur(16px);
    box-shadow: 0 0 50px -10px rgba(247,147,26,0.2);
  `,
  filterItem: css`
    width: 100%;
    text-align: left;
    padding: 12px 16px;
    font-size: 14px;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    color: #ffffff;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.1s ease;

    &:hover {
      background: rgba(255,255,255,0.05);
      color: #F7931A;
    }

    &:last-child {
      border-bottom: none;
    }
  `,
  filterItemActive: css`
    background: rgba(247,147,26,0.1);
    color: #F7931A;

    &:hover {
      background: rgba(247,147,26,0.15);
      color: #F7931A;
    }
  `,
  grid: css`
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 24px;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  `,
  emptyState: css`
    text-align: center;
    padding: 64px;
    background: rgba(15, 17, 21, 0.8);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    color: #94A3B8;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    backdrop-filter: blur(16px);
    box-shadow: 0 0 50px -10px rgba(247,147,26,0.1);
  `,
  focusRing: css`
    &:focus-visible {
      outline: 2px solid #F7931A;
      outline-offset: 2px;
    }
  `,
}));