import type { ReactNode } from 'react'

import styled from '@emotion/styled'
import { Tick02Icon } from 'hugeicons-react'

import { Badge } from '#/-components/ui/primitives/Badge'
import { Button } from '#/-components/ui/primitives/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/-components/ui/primitives/Card'
import { Divider } from '#/-components/ui/primitives/Divider'
import { Typography } from '#/-components/ui/primitives/Typography'
import type { useTenantPackages } from '#/services/tenant/useTenantPackages'
import type { TenantPackage } from '#/types/tenant.type'
import { formatPrice } from '#/utils/formatPrice'
import { humanize } from '#/utils/humanize'

const copy = {
  en: {
    type: '01 — Choose your website type',
    plan: '02 — Choose your package',
    prompt: 'Start with your website. Find the right plan for your next step.',
    loading: 'Loading packages…',
    error: 'Could not load packages.',
    retry: 'Try again',
    empty: 'No packages are available yet. Please check back later.',
    choose: 'Choose a website type above to explore available packages.',
    noMatch: 'No packages are currently available for this website type.',
    features: 'Included in your plan',
    save: 'Save',
    trial: (days: number) => `${days}-day free trial`,
  },
  id: {
    type: '01 — Pilih jenis website',
    plan: '02 — Temukan paketmu',
    prompt: 'Mulai dari kebutuhanmu. Temukan paket untuk langkah berikutnya.',
    loading: 'Memuat paket…',
    error: 'Paket belum berhasil dimuat.',
    retry: 'Coba lagi',
    empty: 'Belum ada paket tersedia. Silakan kembali lagi nanti.',
    choose: 'Pilih jenis website di atas untuk melihat paket yang tersedia.',
    noMatch: 'Belum ada paket tersedia untuk jenis website ini.',
    features: 'Sudah termasuk dalam paket',
    save: 'Hemat',
    trial: (days: number) => `Trial gratis ${days} hari`,
  },
}

const Catalog = styled.div`
  container-type: inline-size;
`

const TypeChoices = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 32px;
`

const TypeButton = styled(Button)`
  gap: 16px;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.radius.full};

  &[aria-pressed='true'] {
    background: ${({ theme }) => theme.colors.primary.DARKER};
    color: ${({ theme }) => theme.colors.text.inverse};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary.DEFAULT};
    outline-offset: 4px;
  }
`

const Status = styled(Card)`
  padding: 36px 24px;
  border: 1px dashed #cddbd2;
  border-radius: 20px;
  background: #f5f8f5;
  color: #52655d;
  font-size: 0.9rem;
  line-height: 1.6;
  text-align: center;

  button {
    margin: 12px auto 0;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 20px;
  margin-top: 18px;
  align-items: stretch;
`

const PricingCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== '$selected',
})<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: clamp(22px, 3cqi, 32px);
  border: 1px solid ${({ $selected }) => ($selected ? '#16845b' : '#dce5de')};
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ $selected }) =>
    $selected
      ? '0 0 0 2px #16845b, 0 16px 40px #16462b14'
      : '0 8px 32px #16462b08'};
  transition:
    box-shadow 180ms ease,
    border-color 180ms ease;

  &:hover {
    border-color: #82b59a;
    box-shadow: 0 12px 36px #16462b14;
  }

  h4 {
    margin: 20px 0 10px;
    color: #172d26;
    font-size: 1.65rem;
    line-height: 1.2;
    letter-spacing: -0.045em;
  }
`

const CardTop = styled(CardHeader)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 28px;
  flex-direction: row;
  margin-bottom: 0;
  color: #286247;
  font-size: 0.65rem;
  font-weight: 750;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`

const Description = styled(CardDescription)`
  margin: 0 0 24px;
  min-height: 3.2em;
  color: #66766e;
  font-size: 0.88rem;
  line-height: 1.6;
`

const PriceBlock = styled.div`
  margin-top: auto;
  padding-bottom: 24px;

  > div {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    min-height: 30px;
    margin-bottom: 8px;
  }

  del {
    color: #748078;
    font-size: 0.82rem;
  }

  small {
    display: block;
    margin-bottom: 6px;
    color: #66766e;
  }

  strong {
    display: block;
    color: #172d26;
    font-size: clamp(1.8rem, 3.5cqi, 2.65rem);
    font-weight: 750;
    line-height: 1.2;
    letter-spacing: -0.055em;
    overflow-wrap: anywhere;
  }

  > span {
    display: block;
    margin-top: 6px;
    color: #66766e;
    font-size: 0.82rem;
  }
`

const Features = styled(CardContent)`
  flex: 1;
  gap: 0;

  > p {
    margin: 0 0 16px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  ul {
    display: grid;
    gap: 12px;
    padding: 0;
    margin: 0;
    list-style: none;
  }
`

const Feature = styled.li<{ $highlighted: boolean }>`
  display: flex;
  align-items: start;
  gap: 10px;
  color: ${({ $highlighted }) => ($highlighted ? '#176443' : '#66766e')};
  font-size: 0.82rem;
  line-height: 1.5;
  font-weight: ${({ $highlighted }) => ($highlighted ? 700 : 400)};

  svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: #16845b;
  }
`

const Action = styled.div`
  > button,
  && > a {
    width: 100%;
    min-height: 48px;
    border-radius: ${({ theme }) => theme.radius.lg};
    color: ${({ theme }) => theme.colors.text.inverse};
    text-decoration: none;
  }

  > :focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary.DEFAULT};
    outline-offset: 4px;
  }
`

const FeatureDivider = styled(Divider)`
  margin-block: 24px;
`

export const PackageCatalog = ({
  query,
  websiteType,
  onWebsiteTypeChange,
  selectedPackageUuid,
  renderAction,
  disabled = false,
  locale = 'en',
}: {
  query: ReturnType<typeof useTenantPackages>
  websiteType: string
  onWebsiteTypeChange: (value: string) => void
  selectedPackageUuid?: string
  renderAction: (pkg: TenantPackage) => ReactNode
  disabled?: boolean
  locale?: keyof typeof copy
}) => {
  const labels = copy[locale]
  const packages = query.data ?? []
  const websiteTypes = [...new Set(packages.map((pkg) => pkg.website_type))]
  const filtered = packages.filter((pkg) => pkg.website_type === websiteType)

  if (query.isPending) return <Status role="status">{labels.loading}</Status>
  if (query.isError)
    return (
      <Status role="alert">
        {labels.error}
        <Button
          type="button"
          variant="outline"
          onClick={() => void query.refetch()}
        >
          {labels.retry}
        </Button>
      </Status>
    )
  if (!packages.length) return <Status role="status">{labels.empty}</Status>

  return (
    <Catalog>
      <Typography
        variant="body"
        color="secondary"
        css={{
          marginBottom: '20px',
        }}
      >
        {labels.prompt}
      </Typography>
      <TypeChoices role="group" aria-label={labels.type}>
        {websiteTypes.map((type) => (
          <TypeButton
            key={type}
            type="button"
            variant={websiteType === type ? 'solid' : 'outline'}
            aria-pressed={websiteType === type}
            disabled={disabled}
            onClick={() => onWebsiteTypeChange(type)}
          >
            {humanize(type)}
          </TypeButton>
        ))}
      </TypeChoices>
      {!websiteType ? (
        <Status role="status">{labels.choose}</Status>
      ) : (
        <>
          {!filtered.length && <Status role="status">{labels.noMatch}</Status>}
          <Grid role="group" aria-label={labels.plan}>
            {filtered.map((pkg) => {
              const original = Number(pkg.original_price)
              const price = Number(pkg.price)
              const hasDiscount = original > price && price >= 0
              const discount = hasDiscount
                ? Math.round(((original - price) / original) * 100)
                : 0

              return (
                <PricingCard
                  role="article"
                  key={pkg.uuid}
                  $selected={selectedPackageUuid === pkg.uuid}
                  data-plan-id={pkg.uuid}
                  data-website-type={pkg.website_type}
                >
                  <CardTop>
                    <Typography variant="caption" color="inherit" weight="bold">
                      {humanize(pkg.tier)}
                    </Typography>
                    {pkg.trial_days > 0 && (
                      <Badge variant="success" size="sm">
                        {labels.trial(pkg.trial_days)}
                      </Badge>
                    )}
                  </CardTop>
                  <CardTitle as="h4">{pkg.title}</CardTitle>
                  <Description>{pkg.description}</Description>
                  <PriceBlock>
                    <div>
                      {hasDiscount && (
                        <Typography
                          as="del"
                          variant="caption"
                          color="secondary"
                        >
                          {formatPrice(original)}
                        </Typography>
                      )}
                      {discount > 0 && (
                        <Badge variant="success" size="sm">
                          {labels.save} {discount}%
                        </Badge>
                      )}
                    </div>
                    {pkg.price_prefix && (
                      <Typography
                        as="small"
                        variant="caption"
                        color="secondary"
                      >
                        {pkg.price_prefix}
                      </Typography>
                    )}
                    <Typography as="strong" variant="display" weight="bold">
                      {formatPrice(pkg.price)}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      {pkg.price_suffix || humanize(pkg.billing_cycle)}
                    </Typography>
                  </PriceBlock>
                  <Action>{renderAction(pkg)}</Action>
                  <FeatureDivider />
                  <Features>
                    <Typography as="p" variant="caption" weight="bold">
                      {labels.features}
                    </Typography>
                    <ul aria-label={`${labels.features}: ${pkg.title}`}>
                      {pkg.features.map((feature, index) => (
                        <Feature
                          key={`${index}-${feature.text}`}
                          $highlighted={feature.is_highlighted}
                        >
                          <Tick02Icon size={17} aria-hidden="true" />
                          {feature.text}
                        </Feature>
                      ))}
                    </ul>
                  </Features>
                </PricingCard>
              )
            })}
          </Grid>
        </>
      )}
    </Catalog>
  )
}
