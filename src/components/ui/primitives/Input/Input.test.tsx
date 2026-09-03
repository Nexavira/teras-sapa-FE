import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ThemeProvider } from '../../ThemeProvider'
import { Input } from './index'

const renderInput = (input: ReactNode) =>
  render(<ThemeProvider>{input}</ThemeProvider>)

describe('Input sizes', () => {
  it.each([
    ['sm', '12px', '4px 8px', '4px', '44px'],
    ['md', '16px', '8px 16px', '8px', '52px'],
    ['lg', '24px', '16px 32px', '12px', '76px'],
  ] as const)(
    'applies the %s size styles',
    (size, fontSize, padding, borderRadius, height) => {
      renderInput(
        <Input aria-label={`${size} input`} size={size} variant="default" />,
      )

      const input = screen.getByRole('textbox', { name: `${size} input` })
      const styles = getComputedStyle(input)

      expect(styles.fontSize).toBe(fontSize)
      expect(styles.padding).toBe(padding)
      expect(styles.borderRadius).toBe(borderRadius)
      expect(styles.height).toBe(height)
      expect(styles.minHeight).toBe(height)
      expect(input.hasAttribute('size')).toBe(false)
    },
  )

  it('keeps the small height when a containing form sets a larger input minimum', () => {
    renderInput(
      <>
        <style>{`form[data-test-form] input { min-height: 60px; }`}</style>
        <form data-test-form>
          <Input aria-label="small input" size="sm" />
        </form>
      </>,
    )

    const styles = getComputedStyle(
      screen.getByRole('textbox', { name: 'small input' }),
    )

    expect(styles.height).toBe('44px')
    expect(styles.minHeight).toBe('44px')
  })
})
