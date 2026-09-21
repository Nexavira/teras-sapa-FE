import React from 'react'

import styled from '@emotion/styled'

import { BlockRenderer } from '#themes/dawn/blocks/BlockRenderer'
import type { SectionComponentProps } from '#themes/shared/types/theme'

export interface ImageWithTextSettings {
  image?: string
  image_position?: 'left' | 'right'
  eyebrow?: string
  heading?: string
  text?: string
  button_label?: string
  button_link?: string
  color_scheme?: string
  padding_top?: number
  padding_bottom?: number
}

const Section = styled.section<{ paddingTop: number; paddingBottom: number }>`
  padding: ${({ paddingTop, paddingBottom }) => `${paddingTop}px 0 ${paddingBottom}px`};
  color: rgb(var(--color-foreground));
  background: var(--gradient-background, rgb(var(--color-background)));
`

const Inner = styled.div<{ imagePosition: 'left' | 'right' }>`
  width: min(
    calc(100% - (2 * var(--gutter-desktop, 32px))),
    var(--page-width, 1280px)
  );
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
  align-items: stretch;

  > div:first-of-type > [data-block-type] {
    height: 100%;
  }

  ${({ imagePosition }) =>
    imagePosition === 'right'
      ? `
        & > div:first-of-type { order: 2; }
        & > div:last-of-type { order: 1; }
      `
      : ''}

  @media (max-width: 820px) {
    width: calc(100% - (2 * var(--gutter-mobile, 16px)));
    grid-template-columns: 1fr;

    & > div:first-of-type,
    & > div:last-of-type {
      order: initial;
    }
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(48px, 7vw, 96px);
  background: rgb(var(--color-background));
  > [data-block-type] {
    width: 100%;
    min-width: 0;
  }
`

export const ImageWithText: React.FC<
  SectionComponentProps<ImageWithTextSettings>
> = ({ id, settings, blocks = {}, blockOrder = [], isEditor = false }) => {
  const {
    image_position = 'left',
    color_scheme = 'scheme-2',
    padding_top = 88,
    padding_bottom = 88,
  } = settings
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
    <Section
      className={`color-${color_scheme} gradient`}
      data-color-scheme={color_scheme}
      paddingBottom={padding_bottom}
      paddingTop={padding_top}
    >
      <Inner imagePosition={image_position}>
        <div>
          {blockOrder
            .filter((blockId) => blocks[blockId].type === 'editorial_image')
            .map(renderBlock)}
        </div>
        <Content>
          {blockOrder
            .filter((blockId) => blocks[blockId].type !== 'editorial_image')
            .map(renderBlock)}
        </Content>
      </Inner>
    </Section>
  )
}
