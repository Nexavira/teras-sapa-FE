import React from 'react'

import styled from '@emotion/styled'

import { BlockRenderer } from '#themes/forge/blocks/BlockRenderer'
import { Reveal } from '#themes/forge/snippets/Reveal'
import { useReveal } from '#themes/forge/snippets/useReveal'
import type { SectionComponentProps } from '#themes/shared/types/theme'

export interface CompanyBentoSettings {
  eyebrow?: string
  heading?: string
  dark_mode?: boolean
  cta_label?: string
  cta_url?: string
}

const SectionContainer = styled.section<{ dark?: boolean }>`
  width: ${({ dark }) =>
    dark ? 'calc(100% - 16px)' : 'min(100%, var(--forge-page-width))'};
  margin: 0 auto;
  padding: var(--forge-section-space) var(--forge-gutter-desktop);
  border-radius: ${({ dark }) => (dark ? 'var(--forge-card-radius)' : '0')};
  background: ${({ dark }) => (dark ? 'var(--forge-ink)' : 'transparent')};
  color: ${({ dark }) => (dark ? 'var(--forge-paper)' : 'inherit')};
  box-shadow: ${({ dark }) =>
    dark ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1)' : 'none'};
  box-sizing: border-box;

  @media (max-width: 767px) {
    width: 100%;
    padding: var(--forge-section-space-mobile) var(--forge-gutter-mobile);
    border-radius: ${({ dark }) => (dark ? 'var(--forge-media-radius)' : '0')};
  }
`

const Eyebrow = styled.p<{ dark?: boolean }>`
  display: inline-flex;
  margin: 0 0 24px;
  padding: 6px 11px;
  border-radius: var(--forge-pill-radius);
  background: ${({ dark }) =>
    dark ? 'rgba(244, 241, 233, 0.1)' : 'rgba(23, 25, 21, 0.06)'};
  color: ${({ dark }) => (dark ? 'var(--forge-paper)' : 'inherit')};
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`

const H2 = styled.h2`
  max-width: var(--forge-content-width);
  margin: 0;
  font: 520 clamp(42px, 6.1vw, 88px) / 0.93 var(--forge-heading);
  letter-spacing: -0.065em;
  text-wrap: balance;
`

const BentoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--forge-grid-gap);
  margin-top: 64px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`

const ArrowLink = styled.a<{ dark?: boolean }>`
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 13px;
  margin-top: 40px;
  padding: 6px 7px 6px 18px;
  border-radius: var(--forge-button-radius);
  background: ${({ dark }) =>
    dark ? 'var(--forge-paper)' : 'var(--forge-ink)'};
  color: ${({ dark }) => (dark ? 'var(--forge-ink)' : 'var(--forge-paper)')};
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  transition: transform 650ms var(--forge-ease);

  span {
    display: grid;
    width: 34px;
    height: 34px;
    place-items: center;
    border-radius: 50%;
    background: var(--forge-orange);
    color: var(--forge-ink);
    transition: transform 650ms var(--forge-ease);
  }

  &:hover span {
    transform: translate(3px, -1px) scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`

export const CompanyBento: React.FC<
  SectionComponentProps<CompanyBentoSettings>
> = ({ id, settings, blocks = {}, blockOrder = [], isEditor = false }) => {
  const rootRef = useReveal()
  const {
    eyebrow = 'What we make',
    heading = 'One partner, from first drawing to factory floor.',
    dark_mode = true,
    cta_label,
    cta_url,
  } = settings

  return (
    <SectionContainer dark={dark_mode} ref={rootRef}>
      <Reveal isEditor={isEditor}>
        {eyebrow && <Eyebrow dark={dark_mode}>{eyebrow}</Eyebrow>}
        {heading && <H2>{heading}</H2>}
      </Reveal>

      {blockOrder.length > 0 && (
        <BentoGrid>
          {blockOrder.map((blockId) => {
            const block = blocks[blockId]
            // if (!block) return null

            return (
              <BlockRenderer
                block={block}
                blockId={blockId}
                isEditor={isEditor}
                key={blockId}
                sectionId={id}
              />
            )
          })}
        </BentoGrid>
      )}

      {cta_label && cta_url && (
        <ArrowLink dark={dark_mode} href={cta_url}>
          {cta_label} <span>↗</span>
        </ArrowLink>
      )}
    </SectionContainer>
  )
}
