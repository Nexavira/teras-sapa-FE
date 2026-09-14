import { useRef } from 'react'

import { Global } from '@emotion/react'

import { CmsSection } from './CmsSection'
import { FloatingMenu } from './FloatingMenu'
import { HeroSection } from './HeroSection'
import { LandingFooter } from './LandingFooter'
import { PaymentsSection } from './PaymentsSection'
import { PlatformSection } from './PlatformSection'
import { PricingSection } from './PricingSection'
import { landingGlobalStyles, LandingRoot } from './shared'
import { TemplatesSection } from './TemplatesSection'
import { useLandingAnimations } from './useLandingAnimations'

export const LandingPage = () => {
  const rootRef = useRef<HTMLElement>(null)
  useLandingAnimations(rootRef)

  return (
    <LandingRoot ref={rootRef} data-landing-root>
      <Global styles={landingGlobalStyles} />
      <FloatingMenu />
      <HeroSection />
      <CmsSection />
      <PlatformSection />
      <PaymentsSection />
      <TemplatesSection />
      <PricingSection />
      <LandingFooter />
    </LandingRoot>
  )
}
