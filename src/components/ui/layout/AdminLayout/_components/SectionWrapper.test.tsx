import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ThemeProvider } from '#/components/ui/ThemeProvider'

import { SectionWrapper } from './SectionWrapper'

afterEach(cleanup)

describe('SectionWrapper', () => {
  it('uses its label to toggle the section content', () => {
    const onToggle = vi.fn()

    render(
      <ThemeProvider>
        <SectionWrapper label="Sales channels" onToggle={onToggle}>
          <a href="/store">Online Store</a>
        </SectionWrapper>
      </ThemeProvider>,
    )

    const heading = screen.getByRole('button', { name: 'Sales channels' })
    const content = document.getElementById(
      heading.getAttribute('aria-controls') as string,
    )

    expect(heading.getAttribute('aria-expanded')).toBe('true')
    expect(content?.getAttribute('aria-hidden')).toBe('false')

    fireEvent.click(heading)

    expect(heading.getAttribute('aria-expanded')).toBe('false')
    expect(content?.getAttribute('aria-hidden')).toBe('true')
    expect(content?.hasAttribute('inert')).toBe(true)
    expect(onToggle).toHaveBeenCalledWith(false)
  })

  it('supports a collapsed initial state', () => {
    render(
      <ThemeProvider>
        <SectionWrapper label="Sales channels" defaultOpen={false}>
          <span>Online Store</span>
        </SectionWrapper>
      </ThemeProvider>,
    )

    expect(
      screen
        .getByRole('button', { name: 'Sales channels' })
        .getAttribute('aria-expanded'),
    ).toBe('false')
  })
})
