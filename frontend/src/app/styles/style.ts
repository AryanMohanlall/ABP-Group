import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css }) => ({
  page: css`
    min-height: 100vh;
    background: #030304;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
  `,
  pageMounted: css`
    opacity: 1;
  `,
  bgOrbPrimary: css`
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(247,147,26,0.15) 0%, transparent 70%);
    top: -200px;
    right: -200px;
    pointer-events: none;
    animation: float 8s ease-in-out infinite;
  `,
  bgOrbSecondary: css`
    position: absolute;
    width: 800px;
    height: 800px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,214,0,0.1) 0%, transparent 70%);
    bottom: -400px;
    left: -400px;
    pointer-events: none;
    animation: float 10s ease-in-out infinite reverse;
  `,
  nav: css`
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 32px;
    background: rgba(3, 3, 4, 0.8);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(16px);
  `,
  logo: css`
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
    font-size: 20px;
    color: #ffffff;
    font-family: 'Space Grotesk', sans-serif;
  `,
  logoImage: css`
    width: 32px;
    height: 32px;
    object-fit: contain;
  `,
  logoImageSmall: css`
    width: 24px;
    height: 24px;
    object-fit: contain;
  `,
  navActions: css`
    display: flex;
    align-items: center;
    gap: 12px;
  `,
  signInBtn: css`
    color: #94A3B8;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 12px;

    &:hover {
      color: #ffffff;
      border-color: rgba(247,147,26,0.5);
      box-shadow: 0 0 20px -5px rgba(247,147,26,0.3);
    }
  `,
  ctaBtn: css`
    background: linear-gradient(to right, #EA580C, #F7931A);
    color: #ffffff;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 9999px;
    box-shadow: 0 0 20px -5px rgba(247,147,26,0.4);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 0 30px -5px rgba(247,147,26,0.6);
    }
  `,
  hero: css`
    padding: 96px 32px 64px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  `,
  heroPill: css`
    padding: 8px 20px;
    background: rgba(15, 17, 21, 0.8);
    border: 1px solid rgba(255,255,255,0.1);
    color: #94A3B8;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border-radius: 9999px;
    backdrop-filter: blur(16px);
  `,
  heroTitle: css`
    margin: 0;
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    font-weight: 600;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    background: linear-gradient(to right, #F7931A, #FFD600);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-family: 'Space Grotesk', sans-serif;
  `,
  heroHighlight: css`
    color: #F7931A;
    text-shadow: 0 0 30px rgba(247,147,26,0.5);
  `,
  heroSubtitle: css`
    max-width: 600px;
    color: #94A3B8;
    font-size: 18px;
    line-height: 1.7;
    margin: 0;
    font-family: 'Inter', sans-serif;
  `,
  promptCard: css`
    width: 100%;
    max-width: 700px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(15, 17, 21, 0.8);
    backdrop-filter: blur(16px);
    border-radius: 16px;
    box-shadow: 0 0 50px -10px rgba(247,147,26,0.1);
  `,
  promptInput: css`
    font-family: 'Inter', sans-serif;
    background: transparent;
    border: none;
    color: #ffffff;
    font-size: 16px;

    &:focus {
      outline: none;
      box-shadow: none;
    }

    &::placeholder {
      color: #94A3B8;
    }
  `,
  promptFooter: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    gap: 12px;
    padding: 12px 20px;
    border-top: 1px solid rgba(255,255,255,0.1);
  `,
  promptLabel: css`
    font-size: 12px;
    color: #94A3B8;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `,
  generateBtn: css`
    background: linear-gradient(to right, #EA580C, #F7931A);
    color: #ffffff;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 9999px;
    box-shadow: 0 0 20px -5px rgba(247,147,26,0.4);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 0 30px -5px rgba(247,147,26,0.6);
    }
  `,
  section: css`
    padding: 64px 32px;
  `,
  sectionTitle: css`
    text-align: center;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 600;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #ffffff;
    font-family: 'Space Grotesk', sans-serif;
  `,
  sectionHighlight: css`
    color: #F7931A;
    text-shadow: 0 0 20px rgba(247,147,26,0.5);
  `,
  sectionSubtitle: css`
    text-align: center;
    color: #94A3B8;
    max-width: 600px;
    margin: 0 auto 48px;
    font-size: 18px;
    line-height: 1.7;
    font-family: 'Inter', sans-serif;
  `,
  featureGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  `,
  featureCard: css`
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(15, 17, 21, 0.8);
    backdrop-filter: blur(16px);
    border-radius: 16px;
    padding: 32px;
    transition: all 0.3s ease;
    box-shadow: 0 0 50px -10px rgba(247,147,26,0.1);

    &:hover {
      transform: translateY(-4px);
      border-color: rgba(247,147,26,0.3);
      box-shadow: 0 0 30px -5px rgba(247,147,26,0.3);
    }
  `,
  featureCard0: css`
    animation-delay: 0s;
  `,
  featureCard1: css`
    animation-delay: 0.1s;
  `,
  featureCard2: css`
    animation-delay: 0.2s;
  `,
  featureCard3: css`
    animation-delay: 0.3s;
  `,
  featureIcon: css`
    width: 48px;
    height: 48px;
    border: 1px solid rgba(247,147,26,0.3);
    background: rgba(247,147,26,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    border-radius: 12px;
  `,
  featureIconDot: css`
    width: 16px;
    height: 16px;
    background: #F7931A;
    border-radius: 50%;
    box-shadow: 0 0 20px -5px rgba(247,147,26,0.6);
  `,
  featureTitle: css`
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #ffffff;
    font-family: 'Space Grotesk', sans-serif;
  `,
  featureDesc: css`
    margin: 0;
    color: #94A3B8;
    line-height: 1.6;
    font-family: 'Inter', sans-serif;
  `,
  pipelineWrap: css`
    display: flex;
    justify-content: center;
  `,
  pipelineCard: css`
    width: 100%;
    max-width: 600px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(15, 17, 21, 0.8);
    backdrop-filter: blur(16px);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 0 50px -10px rgba(247,147,26,0.1);
  `,
  pipelineHeader: css`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    background: linear-gradient(135deg, #EA580C, #F7931A);
    color: #ffffff;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 14px;
  `,
  pipelineDots: css`
    display: flex;
    gap: 8px;
  `,
  pipelineDot: css`
    width: 12px;
    height: 12px;
    background: rgba(255,255,255,0.3);
    border-radius: 50%;
  `,
  pipelineTitle: css`
    font-size: 14px;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
  `,
  pipelineBody: css`
    padding: 24px;
    display: grid;
    gap: 16px;
  `,
  pipelineStep: css`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
  `,
  stepdone: css`
    color: #22C55E;
  `,
  steprunning: css`
    color: #FFD600;
  `,
  steppending: css`
    color: #94A3B8;
  `,
  stepLabel: css`
    flex: 1;
  `,
  stepRight: css`
    font-size: 12px;
    color: #94A3B8;
    font-family: 'Inter', sans-serif;
  `,
  stepIconDone: css`
    color: #22C55E;
  `,
  stepIconRunning: css`
    color: #FFD600;
    animation: pulse 2s ease-in-out infinite;
  `,
  stepIconPending: css`
    color: #1E293B;
  `,
  footer: css`
    padding: 24px 32px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(255,255,255,0.1);
  `,
  footerLogo: css`
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
    color: #F7931A;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-family: 'Space Grotesk', sans-serif;
  `,
  footerText: css`
    color: #94A3B8;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
  `,
}));