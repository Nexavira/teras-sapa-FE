import styled from '@emotion/styled'

import { authColors as colors } from '#/-components/auth/auth-styles'

export const WizardForm = styled.form`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: ${colors.paper};
  color: ${colors.ink};
  font-family: Inter, var(--font-sans, sans-serif);

  input {
    border-color: #d4d4cc;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.92);
    font-family: inherit;
  }
  input:hover:not(:disabled) {
    border-color: #a9a99f;
  }
  input:focus-visible {
    border-color: ${colors.emerald};
    box-shadow: 0 0 0 3px rgba(0, 168, 107, 0.1);
  }
  input[aria-invalid='true'] {
    border-color: ${({ theme }) => theme.colors.error};
  }

  button[type='submit'] {
    min-height: 56px;
    border-color: ${colors.ink};
    border-radius: 12px;
    background: ${colors.ink};
    color: ${colors.white};
    font-family: inherit;
    font-size: 0.74rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  button[type='submit']:hover:not(:disabled) {
    border-color: ${colors.emerald};
    background: ${colors.emerald};
    opacity: 1;
    transform: translateY(-2px);
  }
  @media (prefers-reduced-motion: reduce) {
    button[type='submit']:hover:not(:disabled) {
      transform: none;
    }
  }
`

export const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px 24px;
  min-height: 84px;
  padding: 18px clamp(20px, 4vw, 56px);
  border-bottom: 1px solid ${colors.line};
  background: ${colors.white};

  > strong {
    font-size: clamp(1.45rem, 3vw, 1.875rem);
    font-weight: 800;
    letter-spacing: -0.07em;
    span {
      color: ${colors.emerald};
    }
  }
  > span {
    color: ${colors.muted};
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  @media (max-width: 620px) {
    > span {
      font-size: 0.6rem;
    }
  }
`

export const Progress = styled.ol`
  display: flex;
  gap: 24px;
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${colors.muted};
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  b {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    border: 1px solid ${colors.line};
    border-radius: 8px;
    font-size: 0.7rem;
  }
  li[aria-current='step'] {
    color: ${colors.ink};
    b {
      border-color: ${colors.emerald};
      background: ${colors.emerald};
      color: ${colors.white};
    }
  }
  @media (max-width: 760px) {
    gap: 10px;
    li span {
      display: none;
    }
  }
  @media (max-width: 380px) {
    order: 3;
    justify-content: center;
    width: 100%;
  }
`

export const StepLayout = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding: clamp(44px, 6vw, 92px) 24px;
  background:
    linear-gradient(rgba(17, 17, 17, 0.035) 1px, transparent 1px),
    ${colors.white};
  background-size: 100% 96px;
  @media (max-width: 620px) {
    padding: 36px 20px 44px;
    background-size: 100% 80px;
  }
`

export const Panel = styled.section`
  width: min(100%, 640px);
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  > div:first-child {
    text-align: center;
  }
`

export const Eyebrow = styled.p`
  margin: 0 0 16px;
  color: ${colors.emeraldDark};
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`

export const PanelTitle = styled.h2`
  margin: 0;
  font-size: clamp(2.6rem, 4.5vw, 4.7rem);
  font-weight: 800;
  line-height: 0.94;
  letter-spacing: -0.055em;
  text-transform: uppercase;
  overflow-wrap: anywhere;
  > span {
    display: inline-block;
    overflow: clip;
    vertical-align: bottom;
    max-width: 100%;
    margin-inline-end: 0.22em;
    &:last-child {
      margin-inline-end: 0;
    }
  }
  [data-chapter-word] {
    display: inline-block;
    max-width: 100%;
  }
  &:focus {
    outline: none;
  }
`

export const SupportingText = styled.p`
  max-width: 420px;
  margin: 18px auto 0;
  text-align: center;
  color: ${colors.muted};
  font-size: 0.9rem;
  line-height: 1.65;
`

export const NameFields = styled.div`
  width: min(100%, 520px);
  align-self: center;
  display: grid;
  gap: 14px;
`

export const CategoryChoices = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 420px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const CategoryChoice = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 16px;
  border: 1px solid ${colors.line};
  border-radius: 12px;
  background: ${colors.white};
  color: ${colors.ink};
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: left;
  overflow-wrap: anywhere;
  cursor: pointer;
  transition:
    border-color 150ms ease,
    background 150ms ease,
    box-shadow 150ms ease;
  &[aria-pressed='true'] {
    background: #f0f8f3;
    border-color: ${colors.emerald};
    box-shadow: inset 0 0 0 1px ${colors.emerald};
  }
  &:hover {
    border-color: ${colors.ink};
  }
  &:focus-visible {
    outline: 2px solid ${colors.emerald};
    outline-offset: 3px;
  }
`

export const Actions = styled.div`
  width: min(100%, 520px);
  align-self: center;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  padding-top: 4px;
  > button[type='submit'] {
    width: 100%;
    order: -1;
  }
  > button[type='button'] {
    margin: auto;
    color: ${colors.ink};
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 700;
  }
  > span {
    width: 100%;
    text-align: center;
    font-size: 0.75rem;
    color: ${colors.muted};
  }
`

export const Footer = styled.footer`
  padding: 20px;
  border-top: 1px solid ${colors.line};
  background: ${colors.white};
  text-align: center;
  color: ${colors.muted};
  font-size: 0.68rem;
  letter-spacing: 0.03em;
`
