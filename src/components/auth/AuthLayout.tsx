import * as React from 'react'

import styled from '@emotion/styled'

const Container = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
  background: #f7f8f4;
  padding: 2rem;
  font-family: var(--font-sans);

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 999px;
    filter: blur(4px);
    pointer-events: none;
  }

  &::before {
    width: 28rem;
    height: 28rem;
    left: -12rem;
    top: -14rem;
    background: rgba(255, 90, 95, 0.14);
  }

  &::after {
    width: 24rem;
    height: 24rem;
    right: -9rem;
    bottom: -12rem;
    background: rgba(0, 166, 153, 0.13);
  }

  @media (max-width: 680px) {
    padding: 1rem;
    align-items: start;
  }
`

const AuthCard = styled.main`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(22rem, 1.1fr);
  width: min(100%, 64rem);
  min-height: 38rem;
  overflow: hidden;
  border: 1px solid rgba(24, 24, 27, 0.08);
  border-radius: 1.75rem;
  background: #fff;
  box-shadow: 0 2rem 5rem rgba(24, 24, 27, 0.12);

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    width: min(100%, 34rem);
  }
`

const BrandPanel = styled.aside`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2.5rem;
  color: #fff;
  background:
    radial-gradient(
      circle at 10% 10%,
      rgba(255, 255, 255, 0.14),
      transparent 32%
    ),
    linear-gradient(145deg, #123d3a 0%, #082925 52%, #071e1c 100%);

  @media (max-width: 800px) {
    min-height: 14rem;
    padding: 1.75rem;
  }
`

const Brand = styled.a`
  color: inherit;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  text-decoration: none;

  span {
    color: #ff8a83;
  }
`

const BrandMessage = styled.div`
  max-width: 22rem;

  h2 {
    margin: 0 0 0.85rem;
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2rem, 4vw, 3.25rem);
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: -0.04em;
  }

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.68);
    font-size: 0.92rem;
    line-height: 1.7;
  }

  @media (max-width: 800px) {
    h2 {
      margin-top: 2.5rem;
      font-size: 2rem;
    }

    p {
      display: none;
    }
  }
`

const TrustNote = styled.div`
  align-items: center;
  display: flex;
  gap: 0.55rem;
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.75rem;

  &::before {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: #5be4c0;
    box-shadow: 0 0 0 0.25rem rgba(91, 228, 192, 0.12);
  }

  @media (max-width: 800px) {
    display: none;
  }
`

const FormPanel = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(2rem, 6vw, 4.5rem);

  @media (max-width: 680px) {
    padding: 2rem 1.35rem;
  }
`

const Header = styled.div`
  margin-bottom: 1.75rem;
`

const Title = styled.h1`
  margin: 0 0 0.55rem;
  color: #18181b;
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(2rem, 4vw, 2.65rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.035em;
`

const Subtitle = styled.p`
  margin: 0;
  color: #71717a;
  font-size: 0.9rem;
  line-height: 1.6;
`

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <Container>
      <AuthCard>
        <BrandPanel>
          <Brand href="/">
            TerasSapa<span>.</span>
          </Brand>
          <BrandMessage>
            <h2>Toko digital, dengan caramu sendiri.</h2>
            <p>
              Kelola etalase, konten, dan pertumbuhan bisnismu dari satu ruang
              kerja yang sederhana.
            </p>
          </BrandMessage>
          <TrustNote>Platform commerce untuk bisnis Indonesia</TrustNote>
        </BrandPanel>
        <FormPanel>
          <Header>
            <Title>{title}</Title>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
          </Header>
          {children}
        </FormPanel>
      </AuthCard>
    </Container>
  )
}
