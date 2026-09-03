import type { ReactNode } from 'react'

import { Link } from '@tanstack/react-router'

import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { ArrowUpRight01Icon, Tick02Icon } from 'hugeicons-react'

const colors = {
  emerald: '#00a86b',
  emeraldDark: '#008655',
  ink: '#111111',
  paper: '#f4f3ed',
  white: '#ffffff',
  line: '#d9d8d0',
  muted: '#6b6b66',
}

const riseIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const Page = styled.div`
  min-height: 100svh;
  overflow: hidden;
  background: ${colors.paper};
  color: ${colors.ink};
  font-family: Inter, var(--font-sans);
`

const Header = styled.header`
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 84px;
  padding: 0 clamp(20px, 4vw, 56px);
  border-bottom: 1px solid ${colors.line};
  background-color: white;
`

const Wordmark = styled(Link)`
  color: ${colors.ink};
  font-size: clamp(1.45rem, 3vw, 1.875rem);
  font-weight: 800;
  letter-spacing: -0.07em;
  text-decoration: none;

  span {
    color: ${colors.emerald};
  }
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: ${colors.ink};
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-decoration: none;
  text-transform: uppercase;

  svg {
    transition: transform 180ms ease;
  }

  &:hover svg {
    transform: translate(2px, -2px);
  }

  @media (max-width: 480px) {
    width: 38px;
    height: 38px;
    justify-content: center;
    gap: 0;
    border: 1px solid ${colors.line};
    border-radius: 50%;
    font-size: 0;
  }
`

const Main = styled.main`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(440px, 0.85fr);
  min-height: calc(100svh - 84px);

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`

const StoryPanel = styled.aside`
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  padding: clamp(36px, 5vw, 76px) clamp(24px, 5vw, 72px) 32px;
  border-right: 1px solid ${colors.line};

  &::before {
    position: absolute;
    top: 14%;
    right: -14%;
    width: min(34vw, 520px);
    aspect-ratio: 1;
    border: 1px solid rgba(17, 17, 17, 0.1);
    border-radius: 50%;
    content: '';
    pointer-events: none;
  }

  @media (max-width: 980px) {
    min-height: 540px;
    border-right: 0;
    border-bottom: 1px solid ${colors.line};
  }

  @media (max-width: 620px) {
    min-height: 350px;
    padding: 30px 20px 24px;
  }
`

const StoryTop = styled.div`
  position: relative;
  z-index: 2;
  animation: ${riseIn} 650ms cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const Statement = styled.h2`
  max-width: 820px;
  margin: 0;
  font-size: clamp(3.2rem, 6.2vw, 7rem);
  font-weight: 800;
  line-height: 0.88;
  letter-spacing: -0.055em;
  text-transform: uppercase;

  span {
    display: block;
    color: ${colors.emerald};
  }

  @media (max-width: 620px) {
    max-width: 360px;
    font-size: clamp(2.75rem, 13.5vw, 4.6rem);
  }
`

const Showcase = styled.div`
  position: relative;
  z-index: 2;
  align-self: flex-end;
  width: min(100%, 620px);
  height: clamp(220px, 27vh, 310px);
  margin-top: 40px;
  animation: ${riseIn} 700ms 120ms cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (max-width: 620px) {
    position: absolute;
    right: -40px;
    bottom: 20px;
    width: 230px;
    height: 132px;
    margin: 0;
    opacity: 0.42;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const ProductFrame = styled.div`
  position: absolute;
  inset: 0 15% 14% 0;
  overflow: hidden;
  border: 1px solid ${colors.ink};
  border-radius: 14px;
  background: ${colors.white};
  box-shadow: 14px 14px 0 ${colors.ink};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.78) contrast(0.92);
  }
`

const FrameLabel = styled.span`
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

const MetricCard = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  width: 42%;
  min-width: 190px;
  flex-direction: column;
  padding: clamp(18px, 2.2vw, 28px);
  border-radius: 14px;
  background: ${colors.emerald};
  color: ${colors.white};

  small {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  strong {
    margin-top: 16px;
    font-size: clamp(2rem, 4vw, 4rem);
    line-height: 0.9;
    letter-spacing: -0.06em;
  }

  span {
    margin-top: 8px;
    font-size: 0.72rem;
    opacity: 0.8;
  }

  @media (max-width: 620px) {
    display: none;
  }
`

const FormPanel = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(44px, 6vw, 92px) clamp(24px, 5vw, 72px);
  background:
    linear-gradient(rgba(17, 17, 17, 0.035) 1px, transparent 1px),
    ${colors.white};
  background-size: 100% 96px;

  @media (max-width: 620px) {
    padding: 44px 20px 56px;
    background-size: 100% 80px;
  }
`

const FormInner = styled.div`
  position: relative;
  z-index: 1;
  width: min(100%, 520px);
  animation: ${riseIn} 650ms 80ms cubic-bezier(0.22, 1, 0.36, 1) both;

  form[data-auth-form] {
    gap: 14px;
  }

  form[data-auth-form] input {
    border-color: #d4d4cc;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.92);
    font-family: Inter, var(--font-sans);
  }

  form[data-auth-form] input:hover:not(:disabled) {
    border-color: #a9a99f;
  }

  form[data-auth-form] input:focus-visible {
    border-color: ${colors.emerald};
    box-shadow: 0 0 0 3px rgba(0, 168, 107, 0.1);
  }

  form[data-auth-form] button[type='submit'],
  [data-primary-auth-action] {
    min-height: 56px;
    border-color: ${colors.ink};
    border-radius: 999px;
    background: ${colors.ink};
    color: ${colors.white};
    font-family: Inter, var(--font-sans);
    font-size: 0.74rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  form[data-auth-form] button[type='submit']:hover:not(:disabled),
  [data-primary-auth-action]:hover:not(:disabled) {
    border-color: ${colors.emerald};
    background: ${colors.emerald};
    opacity: 1;
    transform: translateY(-2px);
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const Title = styled.h1`
  max-width: 500px;
  margin: 0;
  font-size: clamp(2.6rem, 4.5vw, 4.7rem);
  font-weight: 800;
  line-height: 0.94;
  letter-spacing: -0.055em;
  text-transform: uppercase;
`

const Subtitle = styled.p`
  max-width: 420px;
  margin: 18px 0 28px;
  color: ${colors.muted};
  font-size: 0.9rem;
  line-height: 1.65;
`

const Promise = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  color: ${colors.muted};
  font-size: 0.68rem;
  letter-spacing: 0.03em;

  svg {
    color: ${colors.emerald};
  }
`

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <Page>
      <Header>
        <Wordmark to="/" aria-label="TerasSapa, kembali ke beranda">
          TerasSapa<span>.</span>
        </Wordmark>
        <BackLink to="/">
          Kembali ke beranda <ArrowUpRight01Icon size={16} />
        </BackLink>
      </Header>

      <Main>
        <StoryPanel>
          <StoryTop>
            <Statement>
              Satu ruang.
              <span>Tanpa batas.</span>
            </Statement>
          </StoryTop>

          <Showcase aria-hidden="true">
            <ProductFrame>
              <img src="/images/dawn/product-grid.webp" alt="" />
              <FrameLabel>Your store / your story</FrameLabel>
            </ProductFrame>
            <MetricCard>
              <small>Creative freedom</small>
              <strong>100%</strong>
              <span>Tanpa potongan marketplace</span>
            </MetricCard>
          </Showcase>
        </StoryPanel>

        <FormPanel>
          <FormInner>
            <Title>{title}</Title>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
            {children}
            <Promise>
              <Tick02Icon size={15} /> Data aman, kendali tetap milikmu.
            </Promise>
          </FormInner>
        </FormPanel>
      </Main>
    </Page>
  )
}
