import type { ReactElement, ReactNode } from 'react'
import { Children, cloneElement, isValidElement } from 'react'

import styled from '@emotion/styled'

export type TextRevealSeparator = 'character' | 'word'
export type TextRevealTrigger = 'load' | 'scroll'

export interface TextRevealProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  'children'
> {
  children: ReactNode
  separator?: TextRevealSeparator
  revealOn?: TextRevealTrigger
}

const Root = styled.span`
  [data-reveal-group] {
    display: inline-block;
    overflow: hidden;
    vertical-align: bottom;
  }

  [data-reveal-item] {
    display: inline-block;
    will-change: transform, opacity;
  }
`

const RevealItem = ({ children }: { children: ReactNode }) => (
  <span data-reveal-item>{children}</span>
)

function splitCharacters(value: string, keyPrefix: string): ReactNode[] {
  return value.split(/(\s+)/).map((part, partIndex) => {
    const partKey = `${keyPrefix}-part-${partIndex}`
    if (/^\s+$/.test(part)) return part

    return (
      <span key={partKey} data-reveal-group>
        {Array.from(part).map((character, characterIndex) => (
          <RevealItem key={`${partKey}-character-${characterIndex}`}>
            {character}
          </RevealItem>
        ))}
      </span>
    )
  })
}

function splitWords(value: string, keyPrefix: string): ReactNode[] {
  return value.split(/(\s+)/).map((part, index) => {
    if (/^\s+$/.test(part)) return part
    return (
      <span key={`${keyPrefix}-word-${index}`} data-reveal-group>
        <RevealItem>{part}</RevealItem>
      </span>
    )
  })
}

function transformNode(
  node: ReactNode,
  separator: TextRevealSeparator,
  keyPrefix: string,
): ReactNode {
  if (typeof node === 'string' || typeof node === 'number') {
    const value = String(node)
    return separator === 'character'
      ? splitCharacters(value, keyPrefix)
      : splitWords(value, keyPrefix)
  }

  if (!isValidElement(node)) return node

  const element = node as ReactElement<{ children?: ReactNode }>
  if (element.props.children === undefined) return element

  return cloneElement(element, {
    children: Children.map(element.props.children, (child, childIndex) =>
      transformNode(child, separator, `${keyPrefix}-${childIndex}`),
    ),
  })
}

function getAccessibleText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (!isValidElement(node)) return ''

  const element = node as ReactElement<{ children?: ReactNode }>
  return Children.toArray(element.props.children)
    .map(getAccessibleText)
    .join('')
}

export const TextReveal = ({
  children,
  separator = 'word',
  revealOn = 'scroll',
  ...props
}: TextRevealProps) => {
  return (
    <Root
      {...props}
      data-text-reveal
      data-reveal-separator={separator}
      data-reveal-on={revealOn}
      aria-label={props['aria-label'] || getAccessibleText(children)}
    >
      <span aria-hidden="true">
        {Children.map(children, (child, index) =>
          transformNode(child, separator, `node-${index}`),
        )}
      </span>
    </Root>
  )
}
