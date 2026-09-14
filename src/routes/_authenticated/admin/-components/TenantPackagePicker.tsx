import type { ReactNode } from 'react'

import styled from '@emotion/styled'

import { authColors as colors } from '#/-components/auth/auth-styles'
import { Button } from '#/-components/ui/primitives/Button'
import { Typography } from '#/-components/ui/primitives/Typography'
import type { useTenantPackages } from '#/services/tenant/useTenantPackages'
import { formatPrice } from '#/utils/formatPrice'

import { onboardingLabel } from '../-utils/onboarding-labels'

const Choices = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  button {
    border-radius: 999px;
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
}: {
  query: ReturnType<typeof useTenantPackages>
  websiteType: string
  onWebsiteTypeChange: (type: string) => void
  selectedPackageUuid: string
  onSelect: (uuid: string) => void
  disabled?: boolean
}) => {
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
  const filtered = packages.filter((pkg) => pkg.website_type === websiteType)

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
            variant={websiteType === type ? 'solid' : 'outline'}
            aria-pressed={websiteType === type}
            disabled={disabled}
            onClick={() => onWebsiteTypeChange(type)}
          >
            <Typography as="span" variant="caption" color="inherit">
              {onboardingLabel(type)}
            </Typography>
          </Button>
        ))}
      </Choices>
      {!websiteType ? (
        <Status>Pilih jenis website untuk melihat paket yang tersedia.</Status>
      ) : (
        <List role="group" aria-label="Paket">
          {!filtered.length && (
            <Status role="status">
              Belum ada paket untuk jenis website ini.
            </Status>
          )}
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
                      <Typography as="span" color="inherit" aria-hidden="true">
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
      )}
    </>
  )
}
