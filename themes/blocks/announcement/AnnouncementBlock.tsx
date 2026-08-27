import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/types/theme'

export interface AnnouncementSettings {
  text?: string
  link?: string
  text_alignment?: 'left' | 'center' | 'right'
  color_scheme?: string
}

const Bar = styled.div<{ alignment: string }>`
  width: 100%;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-align: ${({ alignment }) => alignment};
  color: rgb(var(--color-foreground));
  background-color: rgb(var(--color-background));
  background: var(--gradient-background, rgb(var(--color-background)));
  border-bottom: 1px solid
    var(--color-border, rgba(var(--color-foreground), 0.08));
  transition: all 0.2s ease-in-out;
`

const StyledLink = styled.a`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

export const AnnouncementBlock: React.FC<
  BlockComponentProps<AnnouncementSettings>
> = ({ settings }) => {
  const {
    text = 'Welcome to our store',
    link,
    text_alignment = 'center',
    color_scheme = 'scheme-2',
  } = settings

  const content = link ? (
    <StyledLink href={link}>{text}</StyledLink>
  ) : (
    <span>{text}</span>
  )

  return (
    <Bar
      className={`color-${color_scheme} gradient`}
      data-color-scheme={color_scheme}
      alignment={text_alignment}
    >
      {content}
    </Bar>
  )
}
