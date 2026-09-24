import React from 'react'

import styled from '@emotion/styled'

import { BlockRenderer } from '#themes/forge/blocks/BlockRenderer'
import { useReveal } from '#themes/forge/snippets/useReveal'
import type { SectionComponentProps } from '#themes/shared/types/theme'

export interface CompanyMetricsSettings {
  eyebrow?: string
  heading?: string
  dark_mode?: boolean
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

const Reveal = styled.div`
  opacity: 0;
  transform: translateY(54px);
  filter: blur(7px);
  transition:
    transform 900ms var(--forge-ease),
    opacity 900ms var(--forge-ease),
    filter 900ms var(--forge-ease);

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
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

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--forge-grid-gap);
  margin-top: 48px;

  @media (min-width: 1024px) {
    grid-template-columns: 1.5fr 0.75fr 0.75fr;
  }

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`

export const CompanyMetrics: React.FC<
  SectionComponentProps<CompanyMetricsSettings>
> = ({ id, settings, blocks = {}, blockOrder = [], isEditor = false }) => {
  const rootRef = useReveal()
  const {
    eyebrow = 'Scale / measured',
    heading = 'Industrial capability, human accountability.',
    dark_mode = false,
  } = settings

  return (
    <SectionContainer dark={dark_mode} ref={rootRef}>
      <Reveal data-reveal>
        {eyebrow && <Eyebrow dark={dark_mode}>{eyebrow}</Eyebrow>}
        {heading && <H2>{heading}</H2>}
      </Reveal>

      {blockOrder.length > 0 && (
        <MetricsGrid>
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
        </MetricsGrid>
      )}
    </SectionContainer>
  )
}
