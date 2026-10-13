import React from 'react'

import styled from '@emotion/styled'

import { useForgeSettings } from '../../settings-context'
import type { SectionComponentProps } from '#themes/shared/types/theme'

interface FooterSettings {
  color_scheme?: string
  heading?: string
  email?: string
  location?: string
}

const Shell = styled.footer`
  padding: 8px;
  background: var(--forge-bone);
`
const Core = styled.div`
  overflow: hidden;
  padding: clamp(72px, 10vw, 132px) clamp(24px, 6vw, 88px) 28px;
  border-radius: var(--forge-card-radius);
  background: var(--forge-ink);
  color: var(--forge-paper);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
`
const Eyebrow = styled.p`
  margin: 0 0 24px;
  color: var(--forge-orange);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`
const Heading = styled.h2`
  max-width: var(--forge-content-width);
  margin: 0 0 64px;
  font: 500 clamp(52px, 9vw, 126px)/0.86 var(--forge-heading);
  letter-spacing: -0.075em;
`
const Contact = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 7px 8px 7px 22px;
  border-radius: var(--forge-button-radius);
  background: var(--forge-orange);
  color: var(--forge-ink);
  text-decoration: none;
  font-weight: 750;
  transition: transform 700ms var(--forge-ease);
  span {
    display: grid;
    width: 38px;
    height: 38px;
    place-items: center;
    border-radius: 50%;
    background: rgba(23, 25, 21, 0.1);
    transition: transform 700ms var(--forge-ease);
  }
  &:hover span {
    transform: translate(3px, -1px) scale(1.05);
  }
  &:active {
    transform: scale(0.98);
  }
`
const Sitemap = styled.nav`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px 28px;
  max-width: 720px;
  margin: 72px 0 0 auto;

  a {
    padding: 12px 0;
    color: rgba(244, 241, 233, 0.64);
    text-decoration: none;
    font-size: 12px;
    box-shadow: inset 0 1px rgba(244, 241, 233, 0.1);
    transition:
      transform 650ms var(--forge-ease),
      color 650ms var(--forge-ease);
  }
  a:hover {
    color: var(--forge-paper);
    transform: translateX(5px);
  }
  @media (max-width: 680px) {
    grid-template-columns: 1fr 1fr;
    margin-top: 58px;
  }
`
const Bottom = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 32px;
  margin-top: 110px;
  padding-top: 24px;
  box-shadow: inset 0 1px rgba(244, 241, 233, 0.12);
  color: rgba(244, 241, 233, 0.55);
  font-size: 11px;
  letter-spacing: 0.04em;
  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    gap: 9px;
    margin-top: 72px;
  }
`

const SocialLinks = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;

  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    color: var(--forge-paper);
  }
`

import { BlockRenderer } from '#themes/forge/blocks/BlockRenderer'

export const CompanyFooter: React.FC<SectionComponentProps<FooterSettings>> = ({
  id,
  settings,
  blocks = {},
  blockOrder = [],
  isEditor = false,
}) => {
  const globalSettings = useForgeSettings()
  const socialLinks = [
    ['LinkedIn', globalSettings.social_linkedin],
    ['Instagram', globalSettings.social_instagram],
    ['YouTube', globalSettings.social_youtube],
    ['X', globalSettings.social_x],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]))
  const socialTarget = globalSettings.social_open_new_tab ? '_blank' : undefined

  const hasBlocks = blockOrder.length > 0
  const hasHeadingBlock = blockOrder.some(
    (blockId) => blocks[blockId]?.type === 'heading',
  )
  const resolvedColorScheme = settings.color_scheme || 'scheme-2'

  return (
    <Shell
      className={`color-${resolvedColorScheme}`}
      data-color-scheme={resolvedColorScheme}
      id={id}
    >
      <Core>
        <Eyebrow>
          {globalSettings.company_tagline || 'New business / Global enquiries'}
        </Eyebrow>
        {hasHeadingBlock ? (
          blockOrder
            .filter((blockId) => blocks[blockId]?.type === 'heading')
            .map((blockId) => (
              <BlockRenderer
                block={blocks[blockId]}
                blockId={blockId}
                isEditor={isEditor}
                key={blockId}
                sectionId={id}
              />
            ))
        ) : (
          <Heading>{settings.heading || 'Built for what comes next.'}</Heading>
        )}
        <Contact
          href={`mailto:${settings.email || 'projects@atlas-industries.com'}`}
        >
          Discuss your project <span aria-hidden="true">↗</span>
        </Contact>
        {hasBlocks &&
          blockOrder
            .filter((blockId) => blocks[blockId]?.type !== 'heading')
            .map((blockId) => (
              <BlockRenderer
                block={blocks[blockId]}
                blockId={blockId}
                isEditor={isEditor}
                key={blockId}
                sectionId={id}
              />
            ))}
        <Sitemap aria-label="Footer navigation">
          {[
            ['About', 'about'],
            ['Capabilities', 'capabilities'],
            ['Industries', 'industries'],
            ['Projects', 'projects'],
            ['Sustainability', 'sustainability'],
            ['Insights', 'insights'],
            ['Careers', 'careers'],
            ['Contact', 'contact'],
          ].map(([label, page]) => (
            <a key={page} href={`/preview?theme=forge&template=${page}`}>
              {label}
            </a>
          ))}
        </Sitemap>
        <Bottom>
          <span>
            © {new Date().getFullYear()}{' '}
            {globalSettings.company_name || 'ATLAS INDUSTRIES'}
          </span>
          <span>{settings.location || 'West Java · Indonesia'}</span>
          {socialLinks.length > 0 ? (
            <SocialLinks aria-label="Social links">
              {socialLinks.map(([label, url]) => (
                <a
                  href={url}
                  key={label}
                  rel={socialTarget ? 'noreferrer' : undefined}
                  target={socialTarget}
                >
                  {label}
                </a>
              ))}
            </SocialLinks>
          ) : (
            <span>ISO 9001 / ISO 14001</span>
          )}
        </Bottom>
      </Core>
    </Shell>
  )
}
