import styled from '@emotion/styled'
import { Add01Icon } from 'hugeicons-react'

import { BlockRenderer } from '#themes/dawn/blocks/BlockRenderer'
import type { SectionComponentProps } from '#themes/shared/types/theme'

export interface PageContentSettings {
  color_scheme?: string
  layout?: 'stacked' | 'editorial' | 'accordion' | 'compact'
  image?: string
  image_alt?: string
}

const Content = styled.section<{ compact: boolean }>`
  background: var(--gradient-background, rgb(var(--color-background)));
  color: rgb(var(--color-foreground));
  padding: clamp(48px, 7vw, 88px) 0
    ${({ compact }) => (compact ? '0' : 'clamp(64px, 8vw, 112px)')};

  h1,
  h2,
  h3 {
    font-family: var(--font-heading, Georgia, serif);
    font-weight: var(--font-heading-weight, 500);
    letter-spacing: -0.035em;
    text-wrap: balance;
  }

  h1 {
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    line-height: 1.1;
  }

  h2,
  h3 {
    font-size: clamp(1.5rem, 2.4vw, 2rem);
    line-height: 1.25;
  }

  p {
    max-width: 60ch;
    font-size: 15px;
    line-height: 1.8;
    color: rgba(var(--color-foreground), 0.75);
  }

  a {
    box-shadow: none;
    white-space: nowrap;
  }

  a:hover {
    box-shadow: none;
  }

  a:active {
    transform: translateY(1px);
  }

  a:focus-visible,
  summary:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 6px;
  }

  @media (prefers-reduced-motion: reduce) {
    a,
    svg {
      transition: none;
      transform: none;
    }
  }
`

const Inner = styled.div`
  width: min(
    calc(100% - 2 * var(--gutter-desktop, 32px)),
    var(--page-width, 1280px)
  );
  margin: 0 auto;
  overflow-wrap: anywhere;

  @media (max-width: 767px) {
    width: calc(100% - 2 * var(--gutter-mobile, 16px));
  }
`

const Introduction = styled.div`
  max-width: 800px;
  display: grid;
  gap: 24px;

  p {
    max-width: 56ch;
    font-size: clamp(15px, 1.5vw, 17px);
  }
`

const Body = styled.div<{ editorial: boolean }>`
  margin-top: clamp(40px, 6vw, 72px);
  display: grid;
  grid-template-columns: ${({ editorial }) =>
    editorial ? 'minmax(0, 1.08fr) minmax(0, 0.92fr)' : 'minmax(0, 840px)'};
  gap: clamp(32px, 7vw, 104px);
  align-items: center;

  @media (max-width: 767px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 36px;
  }
`

const Photo = styled.img`
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  object-position: 68% center;
  background: rgba(var(--color-foreground), 0.04);
`

const Articles = styled.div`
  min-width: 0;
  display: grid;
  gap: 40px;
`

const Article = styled.div`
  display: grid;
  gap: 14px;
`

const Answers = styled.div`
  min-width: 0;
  border-top: 1px solid rgba(var(--color-foreground), 0.16);
`

const Answer = styled.details`
  border-bottom: 1px solid rgba(var(--color-foreground), 0.16);

  summary {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 26px 0;
    list-style: none;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary h2,
  summary h3 {
    font-family: var(--font-body, sans-serif);
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 1.6;
    text-wrap: initial;
  }

  summary svg {
    flex-shrink: 0;
    transition: transform 180ms ease;
  }

  &[open] summary svg {
    transform: rotate(45deg);
  }

  > div {
    padding: 0 40px 28px 0;
    display: grid;
    gap: 16px;
  }
`

const Actions = styled.div`
  margin-top: 36px;
`

export const PageContent = ({
  id,
  settings,
  blocks = {},
  blockOrder = [],
  isEditor = false,
}: SectionComponentProps<PageContentSettings>) => {
  const {
    layout = 'stacked',
    image,
    image_alt = '',
    color_scheme = 'scheme-1',
  } = settings
  const groups: Array<Array<string>> = []
  const contentOrder = [...blockOrder]
  const lastId = contentOrder.at(-1)
  const actionId =
    lastId && blocks[lastId].type === 'button' ? contentOrder.pop() : undefined

  for (const blockId of contentOrder) {
    const block = blocks[blockId]
    if (!groups.length || block.type === 'heading') groups.push([])
    groups[groups.length - 1].push(blockId)
  }

  const [introduction = [], ...articles] = groups
  const editorial = layout === 'editorial' && Boolean(image)
  const renderBlock = (blockId: string) => (
    <BlockRenderer
      key={blockId}
      sectionId={id}
      blockId={blockId}
      block={blocks[blockId]}
      isEditor={isEditor}
    />
  )

  return (
    <Content
      compact={layout === 'compact'}
      className={`color-${color_scheme}`}
      data-color-scheme={color_scheme}
    >
      <Inner>
        <Introduction>{introduction.map(renderBlock)}</Introduction>
        {(articles.length > 0 || editorial) && (
          <Body editorial={editorial}>
            {editorial && (
              <Photo src={image} alt={image_alt} width={960} height={720} />
            )}
            {layout === 'accordion' ? (
              <Answers>
                {articles.map(([headingId, ...bodyIds]) => (
                  <Answer key={headingId} open={isEditor || undefined}>
                    <summary>
                      {renderBlock(headingId)}
                      <Add01Icon size={18} aria-hidden="true" />
                    </summary>
                    <div>{bodyIds.map(renderBlock)}</div>
                  </Answer>
                ))}
              </Answers>
            ) : (
              <Articles>
                {articles.map((group) => (
                  <Article key={group[0]}>{group.map(renderBlock)}</Article>
                ))}
                {editorial && actionId && renderBlock(actionId)}
              </Articles>
            )}
          </Body>
        )}
        {actionId && !editorial && <Actions>{renderBlock(actionId)}</Actions>}
      </Inner>
    </Content>
  )
}
