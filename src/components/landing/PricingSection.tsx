import styled from '@emotion/styled'
import { ArrowUpRight01Icon, Tick02Icon } from 'hugeicons-react'

import { TextReveal, Typography } from '#/components/ui'

import { Container, landingColors } from './shared'

const SUBSCRIPTIONS = [
  {
    uuid: '01a032eb-3210-717a-beb2-620f3463e27b',
    title: 'Landing Page',
    tier: 'basic',
    website_type: 'company_profile',
    billing_cycle: 'monthly',
    description: 'Untuk kampanye, portofolio, atau peluncuran produk tunggal.',
    price_prefix: '',
    price: 'Rp 299.000',
    original_price: 'Rp 350.000',
    price_suffix: '/bulan',
    trial_badge: 'Trial Gratis 7 Hari',
    cta: 'Mulai langganan sekarang!',
    features: [
      { text: 'Pilihan Template Basic', is_highlighted: false },
      { text: 'Hingga 5 Halaman Utama', is_highlighted: false },
      { text: 'Hosting & SSL Terkelola', is_highlighted: false },
      { text: 'Integrasi Kontak WhatsApp', is_highlighted: true },
      { text: 'Standar SEO & Analytics', is_highlighted: false },
      { text: 'Gratis Setup & Subdomain', is_highlighted: false },
    ],
    variant: 'default',
  },
  {
    uuid: '01a032eb-3210-717a-beb2-620f3463e27c',
    title: 'Company Profile',
    tier: 'business',
    website_type: 'company_profile',
    billing_cycle: 'monthly',
    description: 'Untuk bisnis yang membutuhkan website lengkap dan kredibel.',
    price_prefix: '',
    price: 'Rp 599.000',
    original_price: 'Rp 700.000',
    price_suffix: '/bulan',
    trial_badge: 'Paling Populer',
    cta: 'Mulai langganan sekarang!',
    features: [
      { text: 'Semua Template Premium', is_highlighted: true },
      { text: 'Hingga 15 Halaman Utama', is_highlighted: false },
      { text: 'Custom Domain & SSL', is_highlighted: false },
      { text: 'CMS Blog Terintegrasi', is_highlighted: true },
      { text: 'SEO & Analytics Lanjutan', is_highlighted: false },
      { text: 'Prioritas Dukungan', is_highlighted: false },
    ],
    variant: 'featured',
  },
  {
    uuid: '01a032eb-3210-717a-beb2-620f3463e27d',
    title: 'Online Store',
    tier: 'commerce',
    website_type: 'online_store',
    billing_cycle: 'monthly',
    description: 'Untuk brand yang siap menjual produk langsung dari website.',
    price_prefix: '',
    price: 'Rp 899.000',
    original_price: 'Rp 1.050.000',
    price_suffix: '/bulan',
    trial_badge: 'Trial Gratis 7 Hari',
    cta: 'Mulai langganan sekarang!',
    features: [
      { text: 'Katalog Produk & Varian', is_highlighted: false },
      { text: 'Checkout & Manajemen Order', is_highlighted: true },
      { text: 'Pembayaran QRIS & VA', is_highlighted: true },
      { text: 'Manajemen Stok', is_highlighted: false },
      { text: 'CMS Blog & SEO', is_highlighted: false },
      { text: 'Analytics Penjualan', is_highlighted: false },
    ],
    variant: 'default',
  },
] as const

const Section = styled.section`
  position: relative;
  padding-bottom: clamp(110px, 13vw, 170px);
  overflow: hidden;
`

const SectionInner = styled(Container)`
  position: relative;
  z-index: 1;
`

const Header = styled.header`
  max-width: 680px;
  margin: 0 auto clamp(52px, 7vw, 78px);
  text-align: center;

  span {
    display: block;
    margin-bottom: 16px;
    color: ${landingColors.emerald};
    font-size: 0.64rem;
    font-weight: 800;
    letter-spacing: 0.17em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0;
    color: ${landingColors.white};
    font-size: clamp(2.3rem, 4.5vw, 4.25rem);
    font-weight: 800;
    line-height: 0.98;
    letter-spacing: -0.065em;
  }
`

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch;
  gap: 18px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`

const PricingCard = styled.article<{ $featured: boolean }>`
  position: relative;
  display: flex;
  min-height: 100%;
  padding: clamp(24px, 3vw, 34px);
  overflow: hidden;
  border: 1px solid
    ${({ $featured }) =>
      $featured ? landingColors.emerald : 'rgba(17, 17, 17, 0.08)'};
  border-radius: 14px;
  background: ${landingColors.paper};
  box-shadow: ${({ $featured }) =>
    $featured ? '0 30px 80px rgba(0, 168, 107, 0.16)' : 'none'};
  color: ${landingColors.ink};
  flex-direction: column;

  &::before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 3px;
    background: ${({ $featured }) =>
      $featured ? landingColors.emerald : 'transparent'};
    content: '';
  }
`

const CardHeader = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;

  h3 {
    margin: 5px 0 0;
    color: ${landingColors.ink};
    font-size: clamp(1.55rem, 2.5vw, 2.15rem);
    letter-spacing: -0.055em;
  }
`

const Tier = styled.span`
  color: ${landingColors.emerald};
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`

const Badge = styled.span`
  flex: 0 0 auto;
  padding: 7px 9px;
  border-radius: 999px;
  background: rgba(0, 168, 107, 0.1);
  color: ${landingColors.emerald};
  font-size: 0.52rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

const Description = styled.p`
  min-height: 48px;
  margin: 0 0 24px;
  color: #70757c;
  font-size: 0.85rem;
  line-height: 1.55;
`

const Price = styled.div`
  display: flex;
  align-items: baseline;
  gap: 7px;
  padding-block: 24px;
  border-top: 1px solid rgba(17, 17, 17, 0.09);
  border-bottom: 1px solid rgba(17, 17, 17, 0.09);

  div {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  del {
    color: #9a9da2;
    font-size: 0.7rem;
    font-weight: 600;
  }

  strong {
    color: ${landingColors.ink};
    font-size: clamp(2rem, 3.4vw, 3rem);
    line-height: 0.95;
    letter-spacing: -0.07em;
  }

  > span {
    color: #777c82;
    font-size: 0.75rem;
    font-weight: 600;
  }
`

const FeatureList = styled.ul`
  display: grid;
  gap: 3px;
  padding: 22px 0 26px;
  margin: 0;
  list-style: none;
`

const Feature = styled.li<{ $highlighted: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 38px;
  padding: 7px 8px;
  border-radius: 8px;
  background: ${({ $highlighted }) =>
    $highlighted ? 'rgba(0, 168, 107, 0.08)' : 'transparent'};
  color: ${({ $highlighted }) =>
    $highlighted ? landingColors.ink : '#62676e'};
  font-size: 0.82rem;
  font-weight: ${({ $highlighted }) => ($highlighted ? 700 : 500)};

  svg {
    flex: 0 0 auto;
    color: ${landingColors.emerald};
  }
`

const Cta = styled.a<{ $featured: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 52px;
  padding: 0 19px;
  margin-top: auto;
  border: 1px solid
    ${({ $featured }) =>
      $featured ? landingColors.emerald : 'rgba(17, 17, 17, 0.18)'};
  border-radius: 999px;
  background: ${({ $featured }) =>
    $featured ? landingColors.emerald : 'transparent'};
  color: ${({ $featured }) =>
    $featured ? landingColors.white : landingColors.ink};
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition:
    border-color 180ms ease,
    background 180ms ease,
    color 180ms ease,
    transform 180ms ease;

  &:hover {
    border-color: ${landingColors.emerald};
    background: ${landingColors.emerald};
    color: ${landingColors.white};
    transform: translateY(-2px);
  }
`

export const PricingSection = () => {
  return (
    <Section id="pricing">
      <SectionInner>
        <Header>
          <span>Pricing</span>
          <h2>
            <TextReveal separator="character">
              Pilih paket yang paling sesuai.
            </TextReveal>
          </h2>
        </Header>

        <PricingGrid>
          {SUBSCRIPTIONS.map((subscription) => {
            const isFeatured = subscription.variant === 'featured'

            return (
              <PricingCard
                key={subscription.uuid}
                $featured={isFeatured}
                data-reveal
                data-hover-target
                data-plan-id={subscription.uuid}
                data-website-type={subscription.website_type}
              >
                <CardHeader>
                  <div>
                    <Tier>{subscription.tier}</Tier>
                    <Typography as="h3" variant="title" weight="bold">
                      {subscription.title}
                    </Typography>
                  </div>
                  <Badge>{subscription.trial_badge}</Badge>
                </CardHeader>

                <Description>{subscription.description}</Description>

                <Price>
                  <div>
                    <del>{subscription.original_price}</del>
                    <strong>
                      {subscription.price_prefix}
                      {subscription.price}
                    </strong>
                  </div>
                  <span>{subscription.price_suffix}</span>
                </Price>

                <FeatureList aria-label={`Fitur paket ${subscription.title}`}>
                  {subscription.features.map((feature) => (
                    <Feature
                      key={feature.text}
                      $highlighted={feature.is_highlighted}
                    >
                      <Tick02Icon
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      {feature.text}
                    </Feature>
                  ))}
                </FeatureList>

                <Cta href="/register" $featured={isFeatured}>
                  {subscription.cta}
                  <ArrowUpRight01Icon size={17} strokeWidth={1.8} />
                </Cta>
              </PricingCard>
            )
          })}
        </PricingGrid>
      </SectionInner>
    </Section>
  )
}
