import type { ReactNode } from 'react'
import { useState } from 'react'

import styled from '@emotion/styled'

import { authColors as colors } from '#/-components/auth/auth-styles'
import { Button } from '#/-components/ui/primitives/Button'
import { Typography } from '#/-components/ui/primitives/Typography'
import type { useTenantPackages } from '#/services/tenant/useTenantPackages'
import type { BillingCycleType } from '#/utils/billingCycle'
import { isMonthly, isYearly, matchesBillingCycle } from '#/utils/billingCycle'
import { formatPrice } from '#/utils/formatPrice'

import { onboardingLabel } from '../-utils/onboarding-labels'

const Choices = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  button {
    border-radius: 8px;
    border-color: ${colors.line};
    color: ${colors.ink};
    background: ${colors.white};
    font-family: inherit;
  }
  button[aria-pressed='true'] {
    border-color: ${colors.ink};
    background: ${colors.ink};
    color: ${colors.white};
  }
  button:hover:not(:disabled) {
    border-color: ${colors.emerald};
  }
`

const CycleFilter = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px;
  background: ${colors.paper};
  border: 1px solid ${colors.line};
  border-radius: 12px;
  margin-top: 12px;
  margin-bottom: 6px;

  button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    min-height: 34px;
    padding: 4px 14px;
    border: 1px solid transparent;
    background: transparent;
    color: ${colors.muted};
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 600;
    transition: all 150ms ease;
  }

  button[aria-pressed='true'] {
    border-color: ${colors.ink};
    background: ${colors.ink};
    color: ${colors.white};
  }

  button[aria-pressed='false']:hover:not(:disabled) {
    color: ${colors.ink};
    background: rgba(0, 0, 0, 0.04);
  }
`

interface AnnualDetailBadgeProps {
  $active?: boolean
}

const AnnualDetailBadge = styled.span<AnnualDetailBadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  background: ${({ $active }) => ($active ? '#00e08b' : '#dcfce7')};
  color: ${({ $active }) => ($active ? '#063f28' : '#15803d')};
  transition: all 150ms ease;
  white-space: nowrap;
`

const List = styled.div`
  display: grid;
  gap: 10px;
`

const PackageCard = styled.button`
  width: 100%;
  padding: 18px 20px;
  border: 1px solid ${colors.line};
  border-radius: 12px;
  background: ${colors.white};
  color: ${colors.ink};
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 150ms ease,
    background 150ms ease;

  &:hover {
    border-color: ${colors.emerald};
  }

  &[aria-pressed='true'] {
    border-color: ${colors.emerald};
    background: #f0f8f3;
    box-shadow: inset 0 0 0 1px ${colors.emerald};
  }

  &:focus-visible {
    outline: 2px solid ${colors.emerald};
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`

const CardHeading = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 6px 12px;
`

const Detail = styled(Typography)`
  display: block;
  margin-top: 6px;
  color: ${colors.muted};
`

const Status = ({
  children,
  role,
}: {
  children: ReactNode
  role?: 'status'
}) => (
  <div role={role}>
    <Typography variant="caption" color="secondary">
      {children}
    </Typography>
  </div>
)

export const TenantPackagePicker = ({
  query,
  websiteType,
  onWebsiteTypeChange,
  selectedPackageUuid,
  onSelect,
  disabled = false,
  billingCycle,
  onBillingCycleChange,
}: {
  query: ReturnType<typeof useTenantPackages>
  websiteType: string
  onWebsiteTypeChange: (type: string) => void
  selectedPackageUuid: string
  onSelect: (uuid: string) => void
  disabled?: boolean
  billingCycle?: BillingCycleType
  onBillingCycleChange?: (cycle: BillingCycleType) => void
}) => {
  const [internalCycle, setInternalCycle] =
    useState<BillingCycleType>('monthly')

  if (query.isPending)
    return <Status role="status">Sedang menyiapkan pilihan paket…</Status>
  if (query.isError)
    return (
      <div role="alert">
        <Status>Pilihan paket belum berhasil dimuat.</Status>
        <Button
          type="button"
          size="sm"
          variant="text"
          onClick={() => void query.refetch()}
        >
          <Typography as="span" variant="caption" color="inherit">
            Coba lagi
          </Typography>
        </Button>
      </div>
    )
  const packages = query.data
  const types = [...new Set(packages.map((pkg) => pkg.website_type))]
  const effectiveWebsiteType = websiteType || types[0] || 'commerce'
  const packagesForType = packages.filter(
    (pkg) => pkg.website_type === effectiveWebsiteType,
  )

  const activeCycle = billingCycle ?? internalCycle
  const hasMonthly = packagesForType.some((pkg) => isMonthly(pkg.billing_cycle))
  const hasYearly = packagesForType.some((pkg) => isYearly(pkg.billing_cycle))

  let effectiveCycle: BillingCycleType = activeCycle
  if (activeCycle === 'monthly' && !hasMonthly && hasYearly) {
    effectiveCycle = 'yearly'
  } else if (activeCycle === 'yearly' && !hasYearly && hasMonthly) {
    effectiveCycle = 'monthly'
  }

  const handleCycleChange = (newCycle: BillingCycleType) => {
    if (newCycle === effectiveCycle) return
    const currentSelectedPkg = packages.find(
      (p) => p.uuid === selectedPackageUuid,
    )
    if (
      currentSelectedPkg &&
      !matchesBillingCycle(currentSelectedPkg.billing_cycle, newCycle)
    ) {
      onSelect('')
    }
    if (onBillingCycleChange) {
      onBillingCycleChange(newCycle)
    } else {
      setInternalCycle(newCycle)
    }
  }

  const filtered = packagesForType.filter((pkg) =>
    matchesBillingCycle(pkg.billing_cycle, effectiveCycle),
  )

  if (!packages.length)
    return <Status role="status">Belum ada paket yang tersedia.</Status>

  return (
    <>
      <Choices role="group" aria-label="Jenis website">
        {types.map((type) => (
          <Button
            key={type}
            type="button"
            size="sm"
            variant={effectiveWebsiteType === type ? 'solid' : 'outline'}
            aria-pressed={effectiveWebsiteType === type}
            disabled={disabled}
            onClick={() => onWebsiteTypeChange(type)}
          >
            <Typography as="span" variant="caption" color="inherit">
              {onboardingLabel(type)}
            </Typography>
          </Button>
        ))}
      </Choices>
      {!effectiveWebsiteType ? (
        <Status>Pilih jenis website untuk melihat paket yang tersedia.</Status>
      ) : (
        <>
          <CycleFilter role="group" aria-label="Periode langganan">
            <Button
              type="button"
              size="sm"
              aria-label="Bulanan"
              variant={effectiveCycle === 'monthly' ? 'solid' : 'ghost'}
              aria-pressed={effectiveCycle === 'monthly'}
              disabled={disabled}
              onClick={() => handleCycleChange('monthly')}
            >
              <Typography as="span" variant="caption" color="inherit">
                Bulanan
              </Typography>
            </Button>
            <Button
              type="button"
              size="sm"
              aria-label="Tahunan"
              variant={effectiveCycle === 'yearly' ? 'solid' : 'ghost'}
              aria-pressed={effectiveCycle === 'yearly'}
              disabled={disabled}
              onClick={() => handleCycleChange('yearly')}
            >
              <Typography as="span" variant="caption" color="inherit">
                Tahunan
              </Typography>
              <AnnualDetailBadge $active={effectiveCycle === 'yearly'}>
                Bayar 10 bulan, bukan 12
              </AnnualDetailBadge>
            </Button>
          </CycleFilter>
          <List role="group" aria-label="Paket">
            {!packagesForType.length ? (
              <Status role="status">
                Belum ada paket untuk jenis website ini.
              </Status>
            ) : !filtered.length ? (
              <Status role="status">
                Belum ada paket untuk periode langganan ini.
              </Status>
            ) : null}
            {filtered.map((pkg) => {
              const selected = selectedPackageUuid === pkg.uuid
              return (
                <PackageCard
                  data-onboarding-choice
                  key={pkg.uuid}
                  type="button"
                  disabled={disabled}
                  aria-label={selected ? 'Terpilih' : `Pilih ${pkg.title}`}
                  aria-pressed={selected}
                  onClick={() => onSelect(pkg.uuid)}
                >
                  <CardHeading>
                    <Typography
                      as="span"
                      variant="body"
                      weight="bold"
                      color="inherit"
                    >
                      {pkg.title}{' '}
                      {selected && (
                        <Typography
                          as="span"
                          color="inherit"
                          aria-hidden="true"
                        >
                          ✓
                        </Typography>
                      )}
                    </Typography>
                    <Typography
                      as="span"
                      variant="body"
                      weight="bold"
                      color="inherit"
                    >
                      {pkg.price_prefix} {formatPrice(pkg.price)}{' '}
                      <Typography as="span" variant="caption" color="inherit">
                        {pkg.price_suffix || onboardingLabel(pkg.billing_cycle)}
                      </Typography>
                    </Typography>
                  </CardHeading>
                  <Detail as="span" variant="caption" color="secondary">
                    {onboardingLabel(pkg.tier)}
                    {pkg.trial_days > 0 &&
                      ` · Coba gratis ${pkg.trial_days} hari`}
                    {effectiveCycle === 'yearly' &&
                      ` · Bayar 10 bulan, bukan 12`}
                  </Detail>
                  <Detail as="span" variant="caption" color="secondary">
                    {pkg.description}
                  </Detail>
                  {pkg.features.map((feature, index) => (
                    <Detail
                      as="span"
                      variant="caption"
                      color="secondary"
                      key={index}
                    >
                      <span aria-hidden="true">✓ </span>
                      {feature.text}
                    </Detail>
                  ))}
                </PackageCard>
              )
            })}
          </List>
        </>
      )}
    </>
  )
}
