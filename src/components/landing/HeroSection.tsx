import styled from '@emotion/styled'
import { ArrowRight01Icon } from 'hugeicons-react'

import { Card, ImageContainer, TextReveal } from '#/components/ui'

import { EmeraldButton, landingColors, LightButton } from './shared'

const Hero = styled.section`
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  background: ${landingColors.black};
  color: ${landingColors.white};
`

const HeroMedia = styled.div`
  position: absolute;
  inset: 0;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.48;
    transform: scale(1.04);
  }

  &::after {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.52),
      rgba(0, 0, 0, 0.05) 42%,
      rgba(0, 0, 0, 0.94)
    );
    content: '';
  }
`

const HeroTextWrapper = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100svh;
  padding: clamp(96px, 12vh, 140px) clamp(16px, 4vw, 56px)
    clamp(64px, 8vh, 96px);
`

const HeroHeadline = styled.h1`
  max-width: 980px;
  margin: 0;
  color: ${landingColors.white};
  font-size: clamp(3.25rem, 7vw, 7.25rem);
  font-weight: 800;
  line-height: 0.92;
  letter-spacing: -0.055em;
  text-align: left;

  > span {
    display: block;
  }

  .accent {
    color: ${landingColors.emerald};
  }
`

const HeroIntro = styled.div`
  max-width: 690px;
  margin-top: clamp(28px, 4vw, 48px);

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.76);
    font-size: clamp(1rem, 1.5vw, 1.2rem);
    font-weight: 300;
    line-height: 1.65;
  }
`

const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 30px;

  @media (max-width: 520px) {
    align-items: stretch;
    flex-direction: column;

    a {
      justify-content: center;
    }
  }
`

const PreviewSection = styled.section`
  position: relative;
  z-index: 4;
  padding: 0 clamp(16px, 4vw, 56px) 96px;
  background: ${landingColors.black};
`

const PreviewGlow = styled.div`
  position: absolute;
  inset: 15% 10%;
  border-radius: 50%;
  background: rgba(0, 168, 107, 0.3);
  filter: blur(110px);
  pointer-events: none;
`

const BrowserCard = styled(Card)`
  position: relative;
  width: min(1400px, 100%);
  margin: 0 auto;
  padding: 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(16px, 2vw, 28px);
  background: #0a0a0a;
  box-shadow: 0 0 80px rgba(0, 168, 107, 0.16);
`

const BrowserBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding-inline: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: #111;

  span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  span:nth-of-type(1) {
    background: #ef4444;
  }
  span:nth-of-type(2) {
    background: #eab308;
  }
  span:nth-of-type(3) {
    background: #22c55e;
  }
`

const PreviewImage = styled(ImageContainer)`
  display: block;
  width: 100%;
  aspect-ratio: 16 / 8.5;
  opacity: 0.9;
  transition: opacity 400ms ease;

  &:hover {
    opacity: 1;
  }
`

const Marquee = styled.div`
  position: relative;
  z-index: 4;
  overflow: hidden;
  padding-block: 28px;
  background: ${landingColors.emerald};
  color: ${landingColors.white};
`

const MarqueeTrack = styled.div`
  display: flex;
  align-items: center;
  width: max-content;
  white-space: nowrap;

  span {
    margin-right: 44px;
    font-size: clamp(1.35rem, 3vw, 2.5rem);
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  span:nth-of-type(even) {
    color: ${landingColors.ink};
  }
`

const MARQUEE_ITEMS = [
  'Tanpa hosting',
  '•',
  '0% biaya marketplace',
  '•',
  'Siap QRIS & VA',
  '•',
  'CMS fleksibel',
  '•',
]

export const HeroSection = () => {
  return (
    <>
      <Hero id="hero">
        <HeroMedia aria-hidden="true">
          <video autoPlay loop muted playsInline>
            <source src="/videos/hero_background.mp4" type="video/mp4" />
          </video>
        </HeroMedia>

        <HeroTextWrapper>
          <HeroHeadline>
            <TextReveal separator="character" revealOn="load">
              Bangun Bisnis Digital
            </TextReveal>
            <TextReveal
              className="accent"
              separator="character"
              revealOn="load"
            >
              Secara Instan &amp;
            </TextReveal>
            <TextReveal
              className="accent"
              separator="character"
              revealOn="load"
            >
              Profesional.
            </TextReveal>
          </HeroHeadline>

          <HeroIntro>
            <p>
              <TextReveal separator="word" revealOn="load">
                Ekosistem website dan CMS untuk UMKM &amp; startup. Pilih
                template, kelola konten, dan mulai berjualan dalam hitungan
                menit.
              </TextReveal>
            </p>
            <HeroActions data-hero-fade>
              <EmeraldButton render={<a href="#pricing" />}>
                Mulai gratis sekarang <ArrowRight01Icon size={17} />
              </EmeraldButton>
            </HeroActions>
          </HeroIntro>
        </HeroTextWrapper>
      </Hero>

      <PreviewSection data-app-preview-section>
        <PreviewGlow />
        <BrowserCard padding="none" data-app-preview>
          <BrowserBar aria-hidden="true">
            <span />
            <span />
            <span />
          </BrowserBar>
          <PreviewImage
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2426&auto=format&fit=crop"
            alt="Tampilan dashboard analitik TerasSapa"
            imageLoading="eager"
          />
        </BrowserCard>
      </PreviewSection>

      <Marquee data-marquee aria-label="Keunggulan platform">
        <MarqueeTrack data-marquee-track>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </MarqueeTrack>
      </Marquee>
    </>
  )
}
