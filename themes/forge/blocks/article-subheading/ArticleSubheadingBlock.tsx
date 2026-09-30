import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/shared/types/theme'

export interface ArticleSubheadingSettings {
  title?: string
}

const Subheading = styled.h2`
  margin: 64px 0 24px;
  color: var(--forge-ink);
  font: 540 clamp(34px, 4vw, 54px) / 1 var(--forge-heading);
  letter-spacing: -0.055em;
`

export const ArticleSubheadingBlock: React.FC<
  BlockComponentProps<ArticleSubheadingSettings>
> = ({ settings, ...restProps }) => {
  const { title } = settings

  if (!title) return null

  return <Subheading {...restProps}>{title}</Subheading>
}
