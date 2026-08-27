import styled from '@emotion/styled'
import { ArrowRight01Icon } from 'hugeicons-react'

import { Card, ImageContainer, TextReveal } from '#/components/ui'

import { EmeraldButton, landingColors } from './shared'

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
  display: flex;
  flex-direction: column;
  justify-content: end;
  min-height: 100svh;

  padding-left: clamp(16px, 4vw, 56px);
  padding-bottom: clamp(32px, 6vh, 64px);
`

const HeroWord = styled.div<{ $position: 'left' | 'right' }>`
  z-index: 2;
  overflow: hidden;
  color: ${({ $position }) =>
    $position === 'left' ? landingColors.white : landingColors.emerald};
  font-size: clamp(4rem, 12vw, 12rem);
  font-weight: 900;
  line-height: 0.78;
  letter-spacing: -0.035em;
  text-align: left;
  text-transform: uppercase;

  > span {
    display: block;
  }

  @media (max-width: 720px) {
    top: ${({ $position }) => ($position === 'left' ? '24%' : '40%')};
    font-size: 15vw;
  }
`

const HeroBottom = styled.div`
  display: flex;
  align-items: flex-end;
  gap: clamp(32px, 7vw, 96px);
  width: min(1180px, calc(100% - 32px));

  margin-top: clamp(100px, 10vw, 120px);

  p {
    max-width: 470px;
    margin: 0;
    color: rgba(255, 255, 255, 0.78);
    font-size: clamp(1rem, 2vw, 1.45rem);
    font-weight: 300;
    line-height: 1.55;
  }

  @media (max-width: 720px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 22px;
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
          <HeroWord $position="left">
            <TextReveal separator="character" revealOn="load">
              Kendalikan
            </TextReveal>
          </HeroWord>
          <HeroWord $position="right">
            <TextReveal separator="character" revealOn="load">
              Bisnismu.
            </TextReveal>
          </HeroWord>

          <HeroBottom>
            <p>
              <TextReveal separator="word" revealOn="load">
                Tinggalkan biaya admin marketplace yang mencekik. Bangun toko
                online premium dan blog SEO-ready dalam hitungan menit.
              </TextReveal>
            </p>
            <div data-hero-fade>
              <EmeraldButton render={<a href="#cms" />}>
                Mulai eksplorasi <ArrowRight01Icon size={17} />
              </EmeraldButton>
            </div>
          </HeroBottom>
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
