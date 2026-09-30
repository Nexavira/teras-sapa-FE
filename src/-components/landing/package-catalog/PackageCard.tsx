import type { ReactNode } from 'react'

import styled from '@emotion/styled'
import { Tick02Icon } from 'hugeicons-react'

import { Badge } from '#/-components/ui/primitives/Badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/-components/ui/primitives/Card'
import { Divider } from '#/-components/ui/primitives/Divider'
import { Typography } from '#/-components/ui/primitives/Typography'
import type { TenantPackage } from '#/types/tenant.type'
import { formatPrice } from '#/utils/formatPrice'
import { humanize } from '#/utils/humanize'

interface PackageCardProps {
  packageData: TenantPackage
  selected: boolean
  action: ReactNode
}

interface PricingCardStyleProps {
  $selected: boolean
}

interface FeatureStyleProps {
  $highlighted: boolean
}

const PackageBadge = styled(Badge)`
  border-radius: ${({ theme }) => theme.radius.sm};
`

const PricingCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== '$selected',
})<PricingCardStyleProps>`
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
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 28px;
  margin-bottom: 0;
  color: #286247;
  font-size: 0.65rem;
  font-weight: 750;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`

const Description = styled(CardDescription)`
  min-height: 3.2em;
  margin: 0 0 24px;
  color: #66766e;
  font-size: 0.88rem;
  line-height: 1.6;
`

const PriceBlock = styled.div`
  margin-top: auto;
  padding-bottom: 24px;

  > div {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
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

const Feature = styled.li<FeatureStyleProps>`
  display: flex;
  align-items: start;
  gap: 10px;
  color: ${({ $highlighted }) => ($highlighted ? '#176443' : '#66766e')};
  font-size: 0.82rem;
  font-weight: ${({ $highlighted }) => ($highlighted ? 700 : 400)};
  line-height: 1.5;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: #16845b;
  }
`

export const PackageCard = ({
  packageData,
  selected,
  action,
}: PackageCardProps) => {
  const originalPrice = Number(packageData.original_price)
  const price = Number(packageData.price)
  const hasDiscount = originalPrice > price && price >= 0
  const discount = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  return (
    <PricingCard
      role="article"
      $selected={selected}
      data-plan-id={packageData.uuid}
      data-website-type={packageData.website_type}
    >
      <CardTop>
        <Typography variant="caption" color="inherit" weight="bold">
          {humanize(packageData.tier)}
        </Typography>
        {packageData.trial_days > 0 && (
          <PackageBadge variant="success" size="sm">
            Trial gratis {packageData.trial_days} hari
          </PackageBadge>
        )}
      </CardTop>
      <CardTitle as="h4">{packageData.title}</CardTitle>
      <Description>{packageData.description}</Description>
      <PriceBlock>
        <div>
          {hasDiscount && (
            <Typography as="del" variant="caption" color="secondary">
              {formatPrice(originalPrice)}
            </Typography>
          )}
          {discount > 0 && (
            <PackageBadge variant="success" size="sm">
              Hemat {discount}%
            </PackageBadge>
          )}
        </div>
        {packageData.price_prefix && (
          <Typography as="small" variant="caption" color="secondary">
            {packageData.price_prefix}
          </Typography>
        )}
        <Typography as="strong" variant="display" weight="bold">
          {formatPrice(packageData.price)}
        </Typography>
        <Typography variant="caption" color="secondary">
          {packageData.price_suffix || humanize(packageData.billing_cycle)}
        </Typography>
      </PriceBlock>
      <Action>{action}</Action>
      <FeatureDivider />
      <Features>
        <Typography as="p" variant="caption" weight="bold">
          Sudah termasuk dalam paket
        </Typography>
        <ul aria-label={`Sudah termasuk dalam paket: ${packageData.title}`}>
          {packageData.features.map((feature, index) => (
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
}
