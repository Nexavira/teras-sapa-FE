import styled from '@emotion/styled'

import { ImageContainer, TextReveal } from '#/components/ui'

import { BodyCopy, Container, landingColors, SectionHeading } from './shared'

const Section = styled.section`
  position: relative;
  padding-block: clamp(120px, 14vw, 180px);
  overflow: hidden;
  background: ${landingColors.ink};
  color: ${landingColors.white};
`

const Background = styled(ImageContainer)`
  position: absolute;
  inset: 0;
  opacity: 0.2;

  > img {
    width: 100%;
    top: -10%;
    height: 120%;
    object-fit: cover;
    filter: grayscale(1);
  }

  &::after {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.38);
    content: '';
  }
`

const Content = styled(Container)`
  position: relative;
  z-index: 1;
  text-align: center;

  ${SectionHeading} {
    margin-bottom: 34px;
    font-size: clamp(4rem, 8vw, 8rem);
  }

  ${BodyCopy} {
    max-width: 820px;
    margin: 0 auto 58px;
    color: rgba(255, 255, 255, 0.65);
    font-size: clamp(1.1rem, 2vw, 1.45rem);
    font-weight: 300;
  }
`

export const PaymentsSection = () => {
  return (
    <Section id="payments" data-payments>
      <Background
        data-parallax
        aria-hidden="true"
        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
        alt=""
      />

      <Content>
        <div>
          <SectionHeading as="h2" color="inherit">
            <TextReveal separator="character">
              Lokal. Cepat. <br /> <em>Aman.</em>
            </TextReveal>
          </SectionHeading>
        </div>
        <BodyCopy as="p" color="inherit">
          <TextReveal separator="word">
            Langsung terima pembayaran. Pembayarandan dengan QRIS, Virtual
            Account bank besar, hingga e-wallet siap digunakan dengan potongan
            admin terendah di Indonesia.
          </TextReveal>
        </BodyCopy>

        {/* <PaymentList>
          {PAYMENT_METHODS.map((method) => (
            <PaymentBadge key={method} data-payment-pill data-hover-target>
              {method}
            </PaymentBadge>
          ))}
        </PaymentList> */}
      </Content>
    </Section>
  )
}
