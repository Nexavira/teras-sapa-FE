import { useRef } from 'react'

import { Global } from '@emotion/react'
import styled from '@emotion/styled'

import { CmsSection } from './CmsSection'
import { FloatingMenu } from './FloatingMenu'
import { HeroSection } from './HeroSection'
import { LandingFooter } from './LandingFooter'
import { PaymentsSection } from './PaymentsSection'
import { PlatformSection } from './PlatformSection'
import { PricingSection } from './PricingSection'
import { landingColors, landingGlobalStyles, LandingRoot } from './shared'
import { TemplatesSection } from './TemplatesSection'
import { useLandingAnimations } from './useLandingAnimations'

const CustomCursor = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${landingColors.emerald};
  mix-blend-mode: difference;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transform-origin: center;

  @media (max-width: 768px), (pointer: coarse) {
    display: none;
  }
`

export const LandingPage = () => {
  const rootRef = useRef<HTMLElement>(null)
  useLandingAnimations(rootRef)

  return (
    <LandingRoot ref={rootRef} data-landing-root>
      <Global styles={landingGlobalStyles} />
      <CustomCursor data-cursor aria-hidden="true" />
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
