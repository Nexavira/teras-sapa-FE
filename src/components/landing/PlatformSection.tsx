import styled from '@emotion/styled'
import { ShoppingBag01Icon } from 'hugeicons-react'

import { ImageContainer, TextReveal, Typography } from '#/components/ui'

import {
  BodyCopy,
  Container,
  LandingCard,
  landingColors,
  SectionHeading,
} from './shared'

const Section = styled.section`
  padding-bottom: clamp(110px, 12vw, 160px);
  background: ${landingColors.white};
`

const Intro = styled.div`
  max-width: 900px;
  margin: 0 auto clamp(64px, 8vw, 96px);
  text-align: center;

  ${SectionHeading} {
    margin-bottom: 26px;
  }

  ${BodyCopy} {
    max-width: 760px;
    margin-inline: auto;
    color: #727780;
  }

  i {
    color: #a4a7ad;
    font-weight: 300;
  }
`

const BentoGrid = styled.div`
  display: grid;
  grid-auto-rows: 330px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-auto-rows: auto;
    grid-template-columns: 1fr;
  }
`

const ShowcaseCard = styled(ImageContainer)`
  position: relative;
  grid-row: span 2;
  grid-column: span 2;
  min-height: 684px;
  padding: 0;
  overflow: hidden;
  color: ${landingColors.white};
  border-radius: 12px;

  > img {
    transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  &::after {
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.9), transparent 68%);
    content: '';
  }

  &:hover > img {
    transform: scale(1.05);
  }

  @media (max-width: 900px) {
    grid-row: span 1;
    min-height: 560px;
  }

  @media (max-width: 620px) {
    grid-column: span 1;
    min-height: 500px;
  }
`

const ShowcaseCopy = styled.div`
  position: absolute;
  z-index: 2;
  right: clamp(24px, 4vw, 48px);
  bottom: clamp(28px, 5vw, 52px);
  left: clamp(24px, 4vw, 48px);

  h3 {
    margin: 0 0 12px;
    color: inherit;
    font-size: clamp(2rem, 4vw, 3rem);
  }

  p {
    max-width: 560px;
    margin: 0;
    color: rgba(255, 255, 255, 0.72);
    font-size: 1.05rem;
    line-height: 1.65;
  }
`

const FeatureCard = styled(LandingCard)<{ $accent?: boolean }>`
  display: flex;
  min-height: 330px;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: ${({ $accent }) =>
    $accent ? landingColors.emerald : landingColors.ink};
  color: ${landingColors.white};
  box-shadow: 0 18px 44px rgba(17, 17, 17, 0.14);

  h3 {
    margin: 0 0 12px;
    color: inherit;
    font-size: 1.75rem;
  }

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.66);
    line-height: 1.6;
  }
`

const IconCircle = styled.div`
  display: grid;
  width: 56px;
  height: 56px;
  margin-bottom: 26px;
  border-radius: 50%;
  background: rgba(0, 168, 107, 0.2);
  color: ${landingColors.emerald};
  place-items: center;
`

const Chart = styled.div`
  position: relative;
  height: 125px;
  margin-top: 24px;
  overflow: hidden;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.1);

  span {
    position: absolute;
    bottom: -12px;
    width: 22%;
    border-radius: 12px 12px 0 0;
    background: rgba(255, 255, 255, 0.35);
    transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
    transform: translateY(20px);
  }

  span:nth-of-type(1) {
    left: 8%;
    height: 55%;
  }
  span:nth-of-type(2) {
    left: 38%;
    height: 80%;
    background: rgba(255, 255, 255, 0.58);
  }
  span:nth-of-type(3) {
    right: 8%;
    height: 105%;
    background: ${landingColors.white};
  }

  ${FeatureCard}:hover & span {
    transform: translateY(0);
  }
`

export const PlatformSection = () => {
  return (
    <Section id="platform">
      <Container>
        <Intro>
          <div>
            <SectionHeading as="h2" color="inherit">
              <TextReveal separator="character">
                Commerce bertemu konten.
              </TextReveal>
            </SectionHeading>
          </div>
          {/* <BodyCopy as="p" color="inherit" data-reveal>
            Marketplace menganggap bisnismu sekadar angka. TerasSapa
            mengizinkanmu membangun identitas merek yang kuat melalui konten
            interaktif dan etalase menawan.
          </BodyCopy> */}
        </Intro>

        <BentoGrid data-reveal>
          <ShowcaseCard
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
            alt="Etalase toko premium"
            data-hover-target
          >
            <ShowcaseCopy>
              <Typography
                as="h3"
                variant="display"
                weight="bold"
                color="inherit"
              >
                Etalase Premium
              </Typography>
              <Typography as="p" variant="body" color="inherit">
                Tampilkan produkmu dalam balutan desain kelas dunia yang
                dirancang untuk meningkatkan konversi dan kepercayaan.
              </Typography>
            </ShowcaseCopy>
          </ShowcaseCard>

          <FeatureCard padding="lg" data-hover-target>
            <div>
              <IconCircle>
                <ShoppingBag01Icon size={26} />
              </IconCircle>
              <Typography as="h3" variant="title" weight="bold" color="inherit">
                Manajemen Inventaris
              </Typography>
              <Typography as="p" variant="body" color="inherit">
                Atur stok, varian, dan harga dalam satu dashboard sentral yang
                intuitif.
              </Typography>
            </div>
          </FeatureCard>

          <FeatureCard $accent padding="lg" data-hover-target>
            <div>
              <Typography
                as="h3"
                variant="display"
                weight="bold"
                color="inherit"
              >
                Analitik <br /> Terpusat
              </Typography>
              <Typography as="p" variant="body" color="inherit">
                Pantau lalu lintas dan penjualan secara real-time.
              </Typography>
            </div>
            <Chart aria-label="Ilustrasi pertumbuhan analitik">
              <span />
              <span />
              <span />
            </Chart>
          </FeatureCard>
        </BentoGrid>
      </Container>
    </Section>
  )
}
