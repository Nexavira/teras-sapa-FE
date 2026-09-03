import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ThemeProvider } from '../../ThemeProvider'
import { Button } from './index'

const renderButton = (button: ReactNode) =>
  render(<ThemeProvider>{button}</ThemeProvider>)

describe('Button icons', () => {
  it('renders start and end icons around the label', () => {
    renderButton(
      <Button
        endIcon={<span data-testid="end-icon">End</span>}
        startIcon={<span data-testid="start-icon">Start</span>}
      >
        Action
      </Button>,
    )

    const button = screen.getByRole('button', { name: /start action end/i })
    expect(
      button.firstElementChild?.contains(screen.getByTestId('start-icon')),
    ).toBe(true)
    expect(
      button.lastElementChild?.contains(screen.getByTestId('end-icon')),
    ).toBe(true)
  })

  it('hides icons while loading', () => {
    renderButton(
      <Button isLoading startIcon={<span data-testid="loading-icon" />}>
        Save
      </Button>,
    )

    expect(
      screen
        .getByRole('button', { name: 'Loading...' })
        .hasAttribute('disabled'),
    ).toBe(true)
    expect(screen.queryByTestId('loading-icon')).toBeNull()
  })

  it('keeps slotted icons smaller than the button', () => {
    renderButton(
      <Button
        size="sm"
        startIcon={<svg data-testid="sized-icon" height="32" width="32" />}
      >
        Add
      </Button>,
    )

    const icon = screen.getByTestId('sized-icon')
    expect(getComputedStyle(icon).width).toBe('14px')
    expect(getComputedStyle(icon).height).toBe('14px')
  })
})
