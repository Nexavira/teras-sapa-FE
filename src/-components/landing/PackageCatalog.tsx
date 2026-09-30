import type { ReactNode } from 'react'
import { useState } from 'react'

import styled from '@emotion/styled'

import { Typography } from '#/-components/ui/primitives/Typography'
import type { useTenantPackages } from '#/services/tenant/useTenantPackages'
import type { TenantPackage } from '#/types/tenant.type'
import type { BillingCycleType } from '#/utils/billingCycle'
import { isMonthly, isYearly, matchesBillingCycle } from '#/utils/billingCycle'

import { CatalogError, CatalogStatus } from './package-catalog/CatalogStatus'
import { PackageCatalogControls } from './package-catalog/PackageCatalogControls'
import { PackageGrid } from './package-catalog/PackageGrid'

export interface PackageCatalogProps {
  query: ReturnType<typeof useTenantPackages>
  websiteType: string
  onWebsiteTypeChange: (value: string) => void
  selectedPackageUuid?: string
  renderAction: (packageData: TenantPackage) => ReactNode
  disabled?: boolean
  billingCycle?: BillingCycleType
  onBillingCycleChange?: (cycle: BillingCycleType) => void
}

const Catalog = styled.div`
  container-type: inline-size;
`

export const PackageCatalog = ({
  query,
  websiteType,
  onWebsiteTypeChange,
  selectedPackageUuid,
  renderAction,
  disabled = false,
  billingCycle,
  onBillingCycleChange,
}: PackageCatalogProps) => {
  const [internalCycle, setInternalCycle] =
    useState<BillingCycleType>('monthly')
  const packages = query.data ?? []
  const websiteTypes = [...new Set(packages.map((pkg) => pkg.website_type))]
  const packagesForType = packages.filter(
    (pkg) => pkg.website_type === websiteType,
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

  const handleBillingCycleChange = (newCycle: BillingCycleType) => {
    if (newCycle === effectiveCycle) return
    if (onBillingCycleChange) {
      onBillingCycleChange(newCycle)
      return
    }
    setInternalCycle(newCycle)
  }

  const filteredPackages = packagesForType.filter((pkg) =>
    matchesBillingCycle(pkg.billing_cycle, effectiveCycle),
  )

  if (query.isPending) {
    return <CatalogStatus role="status">Memuat paket…</CatalogStatus>
  }

  if (query.isError) {
    return <CatalogError onRetry={() => void query.refetch()} />
  }

  if (!packages.length) {
    return (
      <CatalogStatus role="status">
        Belum ada paket tersedia. Silakan kembali lagi nanti.
      </CatalogStatus>
    )
  }

  return (
    <Catalog>
      <Typography
        variant="body"
        color="secondary"
        css={{ marginBottom: '20px' }}
      >
        Mulai dari kebutuhanmu. Temukan paket untuk langkah berikutnya.
      </Typography>
      <PackageCatalogControls
        websiteTypes={websiteTypes}
        websiteType={websiteType}
        billingCycle={effectiveCycle}
        disabled={disabled}
        onWebsiteTypeChange={onWebsiteTypeChange}
        onBillingCycleChange={handleBillingCycleChange}
      />
      {!websiteType ? (
        <CatalogStatus role="status">
          Pilih jenis website di atas untuk melihat paket yang tersedia.
        </CatalogStatus>
      ) : (
        <>
          {!packagesForType.length ? (
            <CatalogStatus role="status">
              Belum ada paket tersedia untuk jenis website ini.
            </CatalogStatus>
          ) : !filteredPackages.length ? (
            <CatalogStatus role="status">
              Belum ada paket tersedia untuk periode langganan ini.
            </CatalogStatus>
          ) : null}
          <PackageGrid
            packages={filteredPackages}
            selectedPackageUuid={selectedPackageUuid}
            renderAction={renderAction}
          />
        </>
      )}
    </Catalog>
  )
}
