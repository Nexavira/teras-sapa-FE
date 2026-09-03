import styled from '@emotion/styled'

import { landingColors, Wordmark } from './shared'

const Header = styled.header`
  position: absolute;
  inset: 0 0 auto;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 24px clamp(20px, 4vw, 56px);
  color: ${landingColors.white};
  mix-blend-mode: difference;

  @media (max-width: 720px) {
    padding-block: 18px;
  }
`

export const LandingHeader = () => {
  return (
    <Header data-navbar>
      <Wordmark href="#hero" aria-label="TerasSapa, kembali ke atas">
        TerasSapa<span>.</span>
      </Wordmark>
    </Header>
  )
}
