import type { CSSProperties, ElementType, FC, ReactNode } from 'react'
import React, { useEffect, useRef } from 'react'

import styled from '@emotion/styled'

export interface RevealProps {
  /** The content to reveal */
  children?: ReactNode
  /** Plain text string to reveal (if using text reveal) */
  text?: string
  /**
   * Mode: 'block' reveals the component/block container;
   * 'text' reveals text content with separator.
   * Defaults to 'text' if `text` is provided, otherwise 'block'.
   */
  variant?: 'block' | 'text'
  /**
   * Separator for text variant:
   * - string: delimiter (e.g. '\n', ' / ', ' • ') to split text and insert separator element
   * - true: renders an animated visual divider line underneath or between lines
   * - ReactNode: custom separator element to render between items
   */
  separator?: string | ReactNode | boolean
  /** Whether reveal animation is enabled. Defaults to true. */
  enabled?: boolean
  /** Force immediate visibility (e.g., in visual editor) */
  isEditor?: boolean
  /** Override duration in ms (defaults to global setting --forge-reveal-duration) */
  duration?: number
  /** Override initial delay in ms (defaults to global setting --forge-reveal-delay) */
  delay?: number
  /** Override stagger delay between text segments/items in ms (defaults to global setting --forge-reveal-stagger) */
  stagger?: number
  /** Override vertical displacement distance in px (default 54px for block, 32px for text) */
  distance?: number
  /** HTML element to render as (default 'div' for block, 'span' for text) */
  as?: ElementType
  /** Additional CSS class names */
  className?: string
  /** Inline CSS style */
  style?: CSSProperties
}

const BlockRevealRoot = styled.div<{
  isEditor?: boolean
  distance?: number
}>`
  width: 100%;
  opacity: ${({ isEditor }) => (isEditor ? '1 !important' : '0')};
  transform: ${({ isEditor, distance = 54 }) =>
    isEditor ? 'none !important' : `translateY(${distance}px)`};
  filter: ${({ isEditor }) => (isEditor ? 'none !important' : 'blur(7px)')};
  transition:
    transform var(--forge-reveal-duration, 900ms) var(--forge-ease),
    opacity var(--forge-reveal-duration, 900ms) var(--forge-ease),
    filter var(--forge-reveal-duration, 900ms) var(--forge-ease);
  transition-delay: var(--reveal-delay, var(--forge-reveal-delay, 0ms));

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }

  [data-forge-reveal='off'] & {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    transition: none !important;
  }
`

const TextRevealRoot = styled.span<{
  isEditor?: boolean
}>`
  display: inline-flex;
  flex-direction: column;
  position: relative;
  width: 100%;

  .reveal-text-content {
    display: inline-block;
    width: 100%;
  }

  [data-forge-reveal='off'] & * {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    transition: none !important;
  }
`

const TextSegment = styled.span`
  display: inline-block;
  opacity: 0;
  transform: translateY(32px);
  filter: blur(5px);
  transition:
    transform var(--forge-reveal-duration, 900ms) var(--forge-ease),
    opacity var(--forge-reveal-duration, 900ms) var(--forge-ease),
    filter var(--forge-reveal-duration, 900ms) var(--forge-ease);

  .is-visible &,
  [data-is-editor='true'] & {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
`

const InlineSeparator = styled.span`
  display: inline-block;
  opacity: 0.45;
  padding: 0 0.35em;
  user-select: none;
`

const CustomSeparatorWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  margin: 0 0.4em;
`

const VisualSeparatorLine = styled.span<{ delay?: number }>`
  display: block;
  width: 100%;
  height: 1px;
  margin-top: 14px;
  background: currentColor;
  opacity: 0.16;
  transform-origin: left;
  transform: scaleX(0);
  transition: transform var(--forge-reveal-duration, 900ms) var(--forge-ease);
  transition-delay: ${({ delay = 0 }) => `${delay}ms`};

  .is-visible &,
  [data-is-editor='true'] & {
    transform: scaleX(1);
  }
`

export const Reveal: FC<RevealProps> = ({
  children,
  text,
  variant,
  separator,
  enabled = true,
  isEditor = false,
  duration,
  delay,
  stagger,
  distance,
  as: Component,
  className,
  style,
  ...restProps
}) => {
  const elementRef = useRef<HTMLElement>(null)
  const isText = variant === 'text' || Boolean(text)
  const TargetComponent = Component || (isText ? 'span' : 'div')

  useEffect(() => {
    if (!enabled || isEditor) return

    const el = elementRef.current
    if (!el) return

    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible')
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.12 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled, isEditor])

  // If reveal is disabled, render content cleanly without animation wrappers
  if (!enabled) {
    return (
      <TargetComponent
        ref={elementRef}
        data-reveal-disabled="true"
        className={className}
        style={style}
        {...restProps}
      >
        {text ?? children}
      </TargetComponent>
    )
  }

  const customStyles: CSSProperties = {
    ...style,
    ...(duration ? { '--forge-reveal-duration': `${duration}ms` } : {}),
    ...(delay !== undefined ? { '--reveal-delay': `${delay}ms` } : {}),
  }

  // --- TEXT REVEAL VARIANT ---
  if (isText) {
    const childArray = React.Children.toArray(children)
    const isChildrenArray = childArray.length > 1
    const rawText = text ?? (typeof children === 'string' ? children : '')

    // String delimiter from prop or detected delimiter in rawText
    const stringDelimiter =
      typeof separator === 'string'
        ? separator
        : separator !== false && !isChildrenArray
          ? rawText.includes(' / ')
            ? ' / '
            : rawText.includes(' | ')
              ? ' | '
              : rawText.includes('\n')
                ? '\n'
                : null
          : null

    const segments: Array<ReactNode> = isChildrenArray
      ? childArray
      : stringDelimiter
        ? rawText.split(stringDelimiter)
        : [rawText || children]

    // Visual divider line when separator is true or by default when no inline delimiter exists
    const hasVisualDivider =
      separator === true ||
      (separator === undefined && !stringDelimiter && segments.length <= 1)

    const customSeparatorNode =
      separator &&
      typeof separator !== 'string' &&
      typeof separator !== 'boolean'
        ? separator
        : null

    // Default inline separator when multiple children are passed and separator is true
    const defaultInlineSeparator =
      separator === true && isChildrenArray && !customSeparatorNode
        ? ' / '
        : null

    const activeInlineDelimiter = stringDelimiter || defaultInlineSeparator

    return (
      <TextRevealRoot
        as={TargetComponent}
        ref={elementRef}
        data-reveal
        data-reveal-text="true"
        data-is-editor={isEditor ? 'true' : undefined}
        className={className}
        style={customStyles}
        isEditor={isEditor}
        {...restProps}
      >
        <span className="reveal-text-content">
          {segments.map((segment, index) => {
            const segmentDelay = `calc(var(--reveal-delay, var(--forge-reveal-delay, 0ms)) + ${index} * ${
              stagger !== undefined
                ? `${stagger}ms`
                : 'var(--forge-reveal-stagger, 100ms)'
            })`

            return (
              <React.Fragment key={index}>
                <TextSegment
                  style={{
                    transitionDelay: isEditor ? '0ms' : segmentDelay,
                  }}
                >
                  {segment}
                </TextSegment>
                {index < segments.length - 1 && (
                  <>
                    {activeInlineDelimiter && (
                      <InlineSeparator
                        className="reveal-inline-separator"
                        aria-hidden="true"
                      >
                        {activeInlineDelimiter === '\n' ? (
                          <br />
                        ) : (
                          activeInlineDelimiter
                        )}
                      </InlineSeparator>
                    )}
                    {customSeparatorNode && (
                      <CustomSeparatorWrapper
                        className="reveal-custom-separator"
                        aria-hidden="true"
                      >
                        {customSeparatorNode}
                      </CustomSeparatorWrapper>
                    )}
                  </>
                )}
              </React.Fragment>
            )
          })}
        </span>

        {hasVisualDivider && (
          <VisualSeparatorLine
            className="reveal-visual-separator"
            aria-hidden="true"
            delay={delay}
          />
        )}
      </TextRevealRoot>
    )
  }

  // --- BLOCK / COMPONENT VARIANT ---
  return (
    <BlockRevealRoot
      as={TargetComponent}
      ref={elementRef}
      data-reveal
      data-reveal-block="true"
      data-is-editor={isEditor ? 'true' : undefined}
      className={className}
      style={customStyles}
      isEditor={isEditor}
      distance={distance}
      {...restProps}
    >
      {children}
    </BlockRevealRoot>
  )
}
