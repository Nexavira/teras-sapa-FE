import styled from '@emotion/styled'

import { Divider, TextReveal, Typography } from '#/components/ui'

import {
  BodyCopy,
  Container,
  landingColors,
  OutlineButton,
  SectionHeading,
  Wordmark,
} from './shared'

const Section = styled.section`
  position: relative;
  padding: clamp(120px, 14vw, 180px) 0 36px;
  overflow: hidden;
  background: ${landingColors.black};
  color: ${landingColors.white};
`

const BackgroundText = styled.div`
  position: absolute;
  top: -2vw;
  left: 0;
  color: rgba(255, 255, 255, 0.045);
  font-size: 24vw;
  font-weight: 900;
  line-height: 0.8;
  letter-spacing: -0.09em;
  white-space: nowrap;
  pointer-events: none;
`

const Cta = styled(Container)`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 56px;
  margin-bottom: clamp(100px, 14vw, 180px);

  ${SectionHeading} {
    margin-bottom: 30px;
    font-size: clamp(4rem, 9vw, 9rem);
  }

  ${BodyCopy} {
    max-width: 580px;
    color: rgba(255, 255, 255, 0.62);
    font-size: clamp(1.05rem, 2vw, 1.4rem);
    font-weight: 300;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    align-items: start;
  }
`

const FooterDivider = styled(Divider)`
  position: relative;
  z-index: 1;
  width: min(100% - 64px, 1280px);
  margin: 0 auto 30px;
  background: rgba(255, 255, 255, 0.18);

  @media (max-width: 720px) {
    width: min(100% - 32px, 1280px);
  }
`

const Footer = styled.footer`
  position: relative;
  z-index: 1;
`

const FooterInner = styled(Container)`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;

  > p {
    justify-self: end;
    margin: 0;
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    justify-items: start;

    > p {
      justify-self: start;
    }
  }
`

const SocialLinks = styled.nav`
  display: flex;
  gap: 28px;

  a {
    color: rgba(255, 255, 255, 0.45);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition: color 180ms ease;
  }

  a:hover {
    color: ${landingColors.white};
  }
`

export const LandingFooter = () => {
  return (
    <Section id="cta">
      <BackgroundText aria-hidden="true">TERASSAPA. TERASSAPA.</BackgroundText>
      <Cta>
        <div>
          <div>
            <SectionHeading as="h2" color="inherit">
              <TextReveal separator="character">Waktunya mandiri.</TextReveal>
            </SectionHeading>
          </div>
          <BodyCopy as="p" color="inherit">
            <TextReveal separator="word">
              Bergabung dengan ratusan merek lokal yang telah merebut kembali
              profit mereka dan membangun rumah digital sendiri.
            </TextReveal>
          </BodyCopy>
        </div>
        <div data-reveal>
          <OutlineButton render={<a href="/register" />}>
            Mulai sekarang — gratis
          </OutlineButton>
        </div>
      </Cta>

      <FooterDivider />
      <Footer>
        <FooterInner>
          <Wordmark href="#hero">
            TERASSAPA<span>.</span>
          </Wordmark>
          <SocialLinks aria-label="Media sosial">
            <a href="#cta">Instagram</a>
            <a href="#cta">Twitter</a>
            <a href="#cta">LinkedIn</a>
          </SocialLinks>
          <Typography as="p" variant="caption" color="inherit">
            © 2026 TerasSapa. Hak cipta dilindungi.
          </Typography>
        </FooterInner>
      </Footer>
    </Section>
  )
}
