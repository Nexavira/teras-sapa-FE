import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/shared/types/theme'

export interface ArticleParagraphSettings {
  content?: string
}

const Paragraph = styled.p`
  margin: 0 0 28px;
  font-size: clamp(17px, 1.5vw, 20px);
  line-height: 1.8;
  color: #44473f;
`

export const ArticleParagraphBlock: React.FC<
  BlockComponentProps<ArticleParagraphSettings>
> = ({ settings, ...restProps }) => {
  const { content } = settings

  if (!content) return null

  return <Paragraph {...restProps}>{content}</Paragraph>
}
