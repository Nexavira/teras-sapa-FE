import styled from '@emotion/styled'

import { Card } from '#/-components/ui/primitives/Card'
import { theme } from '#/-components/ui/theme'

export const Overlay = styled.div<{ $fullScreen?: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: ${({ $fullScreen }) => ($fullScreen ? '0' : '20px')};
  background: rgba(9, 20, 17, 0.62);
  backdrop-filter: blur(5px);
`

export const ModalCard = styled(Card)<{
  $wide?: boolean
  $fullScreen?: boolean
}>`
  width: ${({ $fullScreen, $wide }) =>
    $fullScreen ? '100%' : `min(${$wide ? '1120px' : '520px'}, 100%)`};
  height: ${({ $fullScreen }) => ($fullScreen ? '100dvh' : 'auto')};
  max-height: ${({ $fullScreen }) =>
    $fullScreen ? '100dvh' : 'calc(100vh - 40px)'};
  overflow-y: auto;
  border: ${({ $fullScreen }) =>
    $fullScreen ? '0' : '1px solid rgba(255, 255, 255, 0.7)'};
  border-radius: ${({ $fullScreen }) => ($fullScreen ? '0' : '18px')};
  box-shadow: 0 28px 80px rgba(9, 20, 17, 0.3);
`

export const Intro = styled.div`
  padding: 28px 28px 22px;
  border-bottom: 1px solid ${theme.colors.border};
  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(0, 168, 107, 0.15),
      transparent 15rem
    ),
    ${theme.colors.background};
`

export const StepBadge = styled.span`
  display: inline-flex;
  padding: 6px 10px;
  border-radius: ${theme.radius.full};
  color: ${theme.colors.primary.DARKER};
  background: ${theme.colors.primary.LIGHTER};
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const Title = styled.h2`
  margin: 18px 0 8px;
  color: ${theme.colors.text.primary};
  font-size: clamp(1.55rem, 5vw, 2rem);
  line-height: 1.15;
  letter-spacing: -0.04em;
`

export const Description = styled.p`
  margin: 0;
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
  line-height: 1.6;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: 24px 28px 28px;
  label {
    display: grid;
    gap: 8px;
    font-size: 0.85rem;
  }
  select,
  input {
    max-width: 100%;
    padding: 10px;
    border: 1px solid ${theme.colors.border};
    border-radius: 6px;
    font: inherit;
  }
`

export const SlugPreview = styled.p`
  margin: -8px 0 0;
  color: ${theme.colors.text.secondary};
  font-size: 0.75rem;
  line-height: 1.5;

  strong {
    color: ${theme.colors.primary.DARKER};
    font-weight: 600;
  }
`

export const ErrorMessage = styled.div`
  padding: 10px 12px;
  border: 1px solid rgba(219, 65, 83, 0.35);
  border-radius: ${theme.radius.md};
  color: ${theme.colors.error};
  background: rgba(219, 65, 83, 0.08);
  font-size: 0.8rem;
  line-height: 1.5;
`

export const Footnote = styled.p`
  margin: -4px 0 0;
  color: ${theme.colors.text.secondary};
  font-size: 0.72rem;
  line-height: 1.5;
  text-align: center;
`
