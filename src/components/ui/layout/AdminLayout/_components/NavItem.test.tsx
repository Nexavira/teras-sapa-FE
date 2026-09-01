import type { ReactNode } from 'react'

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ThemeProvider } from '#/components/ui/ThemeProvider'

import { NavItem } from './NavItem'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    className,
  }: {
    children: ReactNode
    className?: string
  }) => <a className={className}>{children}</a>,
  useRouterState: () => ({ location: { pathname: '/admin' } }),
}))

afterEach(cleanup)

describe('NavItem', () => {
  it('toggles nested items when configured as collapsible', () => {
    render(
      <ThemeProvider>
        <NavItem
          icon={<span aria-hidden="true">Icon</span>}
          items={[{ label: 'Themes', to: '/editor' }]}
          defaultOpen={false}
        >
          Online Store
        </NavItem>
      </ThemeProvider>,
    )

    const item = screen.getByRole('button', { name: 'Online Store' })

    expect(item.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(item)
    expect(item.getAttribute('aria-expanded')).toBe('true')
  })
})
