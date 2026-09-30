import { useEffect, useState } from 'react'

import styled from '@emotion/styled'
import { ArrowUpRight01Icon } from 'hugeicons-react'

import { TextReveal } from '#/-components/ui'
import { Button } from '#/-components/ui/primitives/Button'
import { useTenantPackages } from '#/services/tenant/useTenantPackages'
import type { BillingCycleType } from '#/utils/billingCycle'

import { PackageCatalog } from './PackageCatalog'
import { Container, SectionHeading } from './shared'

const Section = styled.section`
  position: relative;
  padding-bottom: clamp(110px, 13vw, 170px);
  overflow: hidden;
`

const Header = styled.header`
  max-width: 900px;
  margin-bottom: clamp(32px, 5vw, 56px);

  h2 {
    margin: 0;
  }
`

export const PricingSection = () => {
  const packages = useTenantPackages()
  const [websiteType, setWebsiteType] = useState('commerce')
  const [billingCycle, setBillingCycle] = useState<BillingCycleType>('monthly')

  useEffect(() => {
    const types = [...new Set(packages.data?.map((pkg) => pkg.website_type))]
    if (!types.includes(websiteType)) {
      setWebsiteType(types[0])
    }
  }, [packages.data, websiteType])

  return (
    <Section id="pricing">
      <Container>
        <Header>
          <SectionHeading as="h2" color="inherit">
            <TextReveal separator="character">
              Pilih paket yang paling sesuai.
            </TextReveal>
          </SectionHeading>
        </Header>
        <PackageCatalog
          query={packages}
          websiteType={websiteType}
          onWebsiteTypeChange={setWebsiteType}
          billingCycle={billingCycle}
          onBillingCycleChange={setBillingCycle}
          renderAction={(pkg) => (
            <Button
              nativeButton={false}
              role="link"
              render={<a href="/register" />}
              endIcon={<ArrowUpRight01Icon size={18} aria-hidden="true" />}
              aria-label={`Mulai dengan ${pkg.title}`}
            >
              Mulai sekarang
            </Button>
          )}
        />
      </Container>
    </Section>
  )
}
