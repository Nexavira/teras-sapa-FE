import styled from '@emotion/styled'
import { FlashIcon, LayoutGridIcon, Search01Icon } from 'hugeicons-react'

import { ImageContainer, TextReveal, Typography } from '#/components/ui'

import { BodyCopy, Container, landingColors } from './shared'

const Section = styled.section`
  position: relative;
  padding-block: clamp(100px, 12vw, 170px);
  overflow: hidden;
  background: ${landingColors.paper};

  &::before {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(17, 17, 17, 0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(17, 17, 17, 0.045) 1px, transparent 1px);
    background-size: clamp(42px, 5vw, 72px) clamp(42px, 5vw, 72px);
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent,
      black 18%,
      black 82%,
      transparent
    );
    mask-image: linear-gradient(
      to bottom,
      transparent,
      black 18%,
      black 82%,
      transparent
    );
    content: '';
    pointer-events: none;
  }

  &::after {
    position: absolute;
    z-index: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: clamp(160px, 20vw, 280px);
    background: linear-gradient(to bottom, transparent, ${landingColors.white});
    content: '';
    pointer-events: none;
  }
`

const SectionInner = styled(Container)`
  position: relative;
  z-index: 1;
`

const Headline = styled.h2`
  // max-width: 920px;
  margin: clamp(40px, 6vw, 74px) 0 clamp(56px, 7vw, 88px);
  color: ${landingColors.ink};
  font-size: clamp(3.2rem, 7vw, 7rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  text-transform: uppercase;

  em {
    color: ${landingColors.emerald};
    font-family: inherit;
    font-style: normal;
  }

  @media (max-width: 640px) {
    font-size: clamp(3rem, 14vw, 4.8rem);
  }
`

const Composition = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(210px, 0.55fr) minmax(480px, 1.45fr);
  align-items: end;
  gap: clamp(24px, 4vw, 64px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 720px) {
    gap: 48px;
  }
`

const Intro = styled.div`
  position: relative;
  z-index: 2;
  padding-top: clamp(12px, 5vw, 70px);

  ${BodyCopy} {
    margin: 0 0 40px;
    color: #555b63;
    font-size: clamp(1rem, 1.4vw, 1.18rem);
    font-weight: 300;
    line-height: 1.7;
  }
`

const Proof = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 13px;
  padding-top: 22px;
  border-top: 1px solid rgba(17, 17, 17, 0.16);

  strong {
    color: ${landingColors.ink};
    font-size: 2.25rem;
    line-height: 1;
    letter-spacing: -0.06em;
  }

  span {
    max-width: 112px;
    color: #777c83;
    font-size: 0.62rem;
    font-weight: 700;
    line-height: 1.45;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
`

const ImageCard = styled(ImageContainer)`
  position: relative;
  z-index: 1;
  min-height: clamp(560px, 60vw, 760px);
  overflow: hidden;
  border: 1px solid rgba(17, 17, 17, 0.1);
  border-radius: 14px;
  background: ${landingColors.ink};
  box-shadow: 0 34px 80px rgba(17, 17, 17, 0.18);

  > img {
    top: -10%;
    height: 120%;
    filter: saturate(0.72) contrast(1.06);
  }

  &::after {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(5, 5, 5, 0.18),
      transparent 42%,
      rgba(5, 5, 5, 0.86)
    );
    content: '';
  }

  @media (max-width: 720px) {
    grid-row: 2;
    min-height: 540px;
  }
`

const ImageCaption = styled.div`
  position: absolute;
  z-index: 2;
  right: clamp(24px, 4vw, 42px);
  bottom: clamp(26px, 5vw, 48px);
  left: clamp(24px, 4vw, 42px);
  color: ${landingColors.white};

  h3 {
    max-width: 490px;
    margin: 0 0 12px;
    color: inherit;
    font-size: clamp(2rem, 4vw, 3.6rem);
    font-weight: 700;
    line-height: 0.98;
    letter-spacing: -0.065em;
  }

  p {
    max-width: 410px;
    margin: 0;
    color: rgba(255, 255, 255, 0.68);
    font-size: 0.92rem;
    line-height: 1.6;
  }
`

const FeatureRail = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: clamp(72px, 9vw, 112px);

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

const Feature = styled.article`
  position: relative;
  display: flex;
  padding: 28px 28px 0;
  overflow: hidden;
  border: 1px solid rgba(17, 17, 17, 0.1);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.74);
  box-shadow: 0 14px 40px rgba(17, 17, 17, 0.05);
  flex-direction: column;
  transition:
    border-color 220ms ease,
    box-shadow 220ms ease,
    transform 300ms cubic-bezier(0.16, 1, 0.3, 1);

  h3 {
    margin: 0px 0px 10px;
    color: ${landingColors.ink};
    font-size: clamp(1.15rem, 1.8vw, 1.45rem);
    letter-spacing: -0.045em;
  }

  p {
    margin: 0;
    color: #73777e;
    font-size: 0.88rem;
    line-height: 1.6;
  }
`

const FeatureVisual = styled.div`
  position: relative;
  display: grid;
  min-height: 150px;
  margin: auto -28px 0;
  padding: 38px 28px 22px;
  overflow: hidden;
  background: linear-gradient(
    to bottom,
    rgba(240, 243, 241, 0),
    rgba(240, 243, 241, 0.9) 34%,
    #f0f3f1 56%
  );
  place-items: center;
`

const LayoutVisual = styled.div`
  display: grid;
  width: 100%;
  gap: 9px;

  span {
    display: block;
    height: 11px;
    border-radius: 3px;
    background: rgba(0, 168, 107, 0.16);
  }

  span::before {
    display: block;
    width: 78%;
    height: 100%;
    border-radius: inherit;
    background: ${landingColors.emerald};
    opacity: 0.58;
    content: '';
  }

  span:nth-of-type(2)::before {
    width: 54%;
  }

  span:nth-of-type(3)::before {
    width: 34%;
  }
`

const LiveVisual = styled.div`
  display: grid;
  width: 72px;
  height: 72px;
  border: 3px solid rgba(0, 168, 107, 0.18);
  border-top-color: ${landingColors.emerald};
  border-right-color: ${landingColors.emerald};
  border-radius: 50%;
  color: ${landingColors.emerald};
  font-size: 0.72rem;
  font-weight: 800;
  transform: rotate(18deg);
  place-items: center;

  span {
    transform: rotate(-18deg);
  }
`

const SeoVisual = styled.div`
  width: 100%;

  > div:first-of-type {
    display: flex;
    justify-content: space-between;
    margin-bottom: 9px;
    color: #777c83;
    font-size: 0.55rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  > span {
    display: block;
    height: 8px;
    margin-bottom: 18px;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(0, 168, 107, 0.14);
  }

  > span::before {
    display: block;
    width: 94%;
    height: 100%;
    border-radius: inherit;
    background: ${landingColors.emerald};
    content: '';
  }

  > div:last-of-type {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }

  > div:last-of-type span {
    height: 24px;
    border-radius: 3px;
    background: rgba(0, 168, 107, 0.6);
  }
`

const FEATURES = [
  {
    number: '01',
    title: 'Rakit sendiri',
    description:
      'Susun halaman dari komponen modular yang fleksibel dan mudah digunakan.',
    icon: LayoutGridIcon,
  },
  {
    number: '02',
    title: 'Visual editor real-time',
    description:
      'Ubah layout langsung di kanvas. Hasilnya terlihat saat itu juga.',
    icon: FlashIcon,
    badge: 'Real-time',
  },
  {
    number: '03',
    title: 'SEO ready',
    description:
      'Struktur teknis yang siap membantu produk dan artikel ditemukan.',
    icon: Search01Icon,
  },
]

export const CmsSection = () => {
  return (
    <Section id="cms">
      <SectionInner>
        <Headline>
          <TextReveal separator="character">
            Bukan template. <br />
            <em>Ini milikmu.</em>
          </TextReveal>
        </Headline>

        <Composition>
          <Intro data-reveal>
            <BodyCopy as="p" color="inherit">
              Tidak perlu mahir coding. Tarik, lepas, lalu rakit pengalaman
              digital yang benar-benar terasa seperti bukan toko milik semua
              orang.
            </BodyCopy>
            <Proof>
              <strong>0</strong>
              <span>baris kode untuk mulai</span>
            </Proof>
          </Intro>

          <ImageCard
            data-reveal
            data-parallax
            data-hover-target
            src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop"
            alt="Pratinjau pengalaman visual yang dibuat dengan CMS TerasSapa"
          >
            <ImageCaption>
              <Typography
                as="h3"
                variant="display"
                weight="bold"
                color="inherit"
              >
                Desain yang terasa seperti milikmu.
              </Typography>
              <Typography as="p" variant="body" color="inherit">
                Bangun halaman langsung dari browser dan lihat setiap perubahan
                saat itu juga.
              </Typography>
            </ImageCaption>
          </ImageCard>
        </Composition>

        <FeatureRail data-reveal>
          {FEATURES.map((feature) => {
            return (
              <Feature key={feature.number} data-hover-target>
                <Typography as="h3" variant="title" weight="bold">
                  {feature.title}
                </Typography>
                <Typography as="p" variant="body" color="secondary">
                  {feature.description}
                </Typography>

                <FeatureVisual aria-hidden="true">
                  {feature.number === '01' ? (
                    <LayoutVisual>
                      <span />
                      <span />
                      <span />
                    </LayoutVisual>
                  ) : null}
                  {feature.number === '02' ? (
                    <LiveVisual>
                      <span>LIVE</span>
                    </LiveVisual>
                  ) : null}
                  {feature.number === '03' ? (
                    <SeoVisual>
                      <div>
                        <span>Performance</span>
                        <span>94%</span>
                      </div>
                      <span />
                      <div>
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>
                    </SeoVisual>
                  ) : null}
                </FeatureVisual>
              </Feature>
            )
          })}
        </FeatureRail>
      </SectionInner>
    </Section>
  )
}
