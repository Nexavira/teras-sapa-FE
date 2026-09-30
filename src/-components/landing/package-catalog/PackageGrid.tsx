import type { ReactNode } from 'react'

import styled from '@emotion/styled'

import type { TenantPackage } from '#/types/tenant.type'

import { PackageCard } from './PackageCard'

interface PackageGridProps {
  packages: Array<TenantPackage>
  selectedPackageUuid?: string
  renderAction: (packageData: TenantPackage) => ReactNode
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  align-items: stretch;
  gap: 20px;
  margin-top: 18px;
`

export const PackageGrid = ({
  packages,
  selectedPackageUuid,
  renderAction,
}: PackageGridProps) => (
  <Grid role="group" aria-label="Temukan paketmu">
    {packages.map((packageData) => (
      <PackageCard
        key={packageData.uuid}
        packageData={packageData}
        selected={selectedPackageUuid === packageData.uuid}
        action={renderAction(packageData)}
      />
    ))}
  </Grid>
)
