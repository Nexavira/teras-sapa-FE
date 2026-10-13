import React from 'react'

import styled from '@emotion/styled'

import { BlockRenderer } from '#themes/forge/blocks/BlockRenderer'
import { Reveal } from '#themes/forge/snippets/Reveal'
import { useReveal } from '#themes/forge/snippets/useReveal'
import type { SectionComponentProps } from '#themes/shared/types/theme'

export interface CompanyArticleSettings {
  color_scheme?: string
  eyebrow?: string
  author_name?: string
  author_role?: string
  read_time?: string
  date?: string
}

const SectionContainer = styled.section`
  width: min(100%, var(--forge-page-width));
  margin: 0 auto;
  padding: var(--forge-section-space) var(--forge-gutter-desktop);
  box-sizing: border-box;

  @media (max-width: 767px) {
    width: 100%;
    padding: var(--forge-section-space-mobile) var(--forge-gutter-mobile);
  }
`

const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
  gap: clamp(42px, 9vw, 130px);

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`

const Eyebrow = styled.p`
  display: inline-flex;
  margin: 0 0 24px;
  padding: 6px 11px;
  border-radius: var(--forge-pill-radius);
  background: rgba(23, 25, 21, 0.06);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`

const MetaSidebar = styled.aside`
  p {
    margin: 0 0 24px;
    font-size: 14px;
    color: #676a63;
    line-height: 1.6;
    white-space: pre-line;
  }
`

const ArticleContentWrapper = styled.article`
  max-width: 760px;
  width: 100%;
`

export const CompanyArticle: React.FC<
  SectionComponentProps<CompanyArticleSettings>
> = ({ id, settings, blocks = {}, blockOrder = [], isEditor = false }) => {
  const rootRef = useReveal()
  const {
    color_scheme = 'scheme-1',
    eyebrow = 'Field note / 018',
    author_name = 'Raka Santoso',
    author_role = 'Director of Engineering',
    read_time = '8 minute read',
    date = '18 September 2026',
  } = settings

  return (
    <SectionContainer
      className={`color-${color_scheme}`}
      data-color-scheme={color_scheme}
      id={id}
      ref={rootRef}
    >
      <Reveal isEditor={isEditor}>
        <ArticleGrid>
          <MetaSidebar>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {(author_name || author_role) && (
              <p>
                {author_name && <>By {author_name}</>}
                {author_name && author_role && <br />}
                {author_role}
              </p>
            )}
            {(read_time || date) && (
              <p>
                {read_time}
                {read_time && date && <br />}
                {date}
              </p>
            )}
          </MetaSidebar>

          <ArticleContentWrapper>
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
          </ArticleContentWrapper>
        </ArticleGrid>
      </Reveal>
    </SectionContainer>
  )
}
