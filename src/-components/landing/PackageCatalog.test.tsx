import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { PricingSection } from '#/-components/landing/PricingSection'
import { ThemeProvider } from '#/-components/ui/ThemeProvider'
import { SubscriptionForm } from '#/routes/_authenticated/admin/-schema/SubscriptionForm'
import type { TenantPackage } from '#/types/tenant.type'

const starter: TenantPackage = {
  uuid: 'commerce-basic',
  title: 'Commerce Starter',
  tier: 'basic',
  website_type: 'commerce',
  billing_cycle: 'annually',
  description: 'An elegant storefront for your business.',
  price_prefix: '',
  price: '3990000',
  original_price: '5400000',
  price_suffix: '/tahun',
  trial_days: 7,
  features: [{ text: 'E-Commerce Templates', is_highlighted: true }],
}
const packages: TenantPackage[] = [
  starter,
  {
    ...starter,
    uuid: 'commerce-business',
    title: 'Commerce Business',
    tier: 'business',
    price: '5990000',
    original_price: null,
    trial_days: 0,
  },
  {
    ...starter,
    uuid: 'profile-basic',
    title: 'Company Starter',
    website_type: 'company_profile',
  },
]
const response = (data: unknown) =>
  new Response(JSON.stringify({ success: true, data }), {
    headers: { 'Content-Type': 'application/json' },
  })
const renderWithQuery = (children: ReactNode) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  render(
    <QueryClientProvider client={client}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>,
  )
  return client
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('API package selection', () => {
  it('deduplicates website types, filters cards and clears the package when the type changes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response(packages)))
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderWithQuery(<SubscriptionForm isPending={false} onSubmit={onSubmit} />)
    const commerce = await screen.findByRole('button', { name: 'Commerce' })
    expect(screen.getAllByRole('button', { name: 'Commerce' })).toHaveLength(1)
    expect(
      screen.queryByRole('heading', { name: 'Commerce Starter' }),
    ).toBeNull()
    expect(
      screen
        .getByRole('button', { name: 'Subscribe' })
        .hasAttribute('disabled'),
    ).toBe(true)
    fireEvent.click(commerce)
    expect(
      screen.getByRole('heading', { name: 'Commerce Starter' }),
    ).toBeTruthy()
    expect(
      screen.getByRole('heading', { name: 'Commerce Business' }),
    ).toBeTruthy()
    expect(
      screen.queryByRole('heading', { name: 'Company Starter' }),
    ).toBeNull()
    fireEvent.click(
      screen.getByRole('button', { name: 'Select Commerce Starter' }),
    )
    expect(
      screen
        .getByRole('button', { name: 'Select Commerce Starter' })
        .getAttribute('aria-pressed'),
    ).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Company Profile' }))
    expect(
      screen
        .getByRole('button', { name: 'Subscribe' })
        .hasAttribute('disabled'),
    ).toBe(true)
    expect(
      screen.queryByRole('heading', { name: 'Commerce Starter' }),
    ).toBeNull()
    fireEvent.click(
      screen.getByRole('button', { name: 'Select Company Starter' }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ package_uuid: 'profile-basic' }),
    )
  })

  it('loads landing prices from the endpoint and shows only the chosen website type', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(packages))
    vi.stubGlobal('fetch', fetchMock)
    renderWithQuery(<PricingSection />)
    fireEvent.click(await screen.findByRole('button', { name: 'Commerce' }))
    expect(String(fetchMock.mock.calls[0][0])).toMatch(
      /\/api\/v1\/portal\/master\/package$/,
    )
    expect(screen.getByText(/Rp\s*3\.990\.000/)).toBeTruthy()
    expect(screen.getByText(/Rp\s*5\.400\.000/).tagName).toBe('DEL')
    expect(screen.getByText('Hemat 26%')).toBeTruthy()
    expect(screen.getAllByText('Trial gratis 7 hari')).toHaveLength(1)
    expect(screen.getAllByText('E-Commerce Templates')).toHaveLength(2)
    expect(
      screen
        .getByRole('link', { name: 'Mulai dengan Commerce Starter' })
        .getAttribute('href'),
    ).toBe('/register')
    fireEvent.click(screen.getByRole('button', { name: 'Company Profile' }))
    expect(
      screen.queryByRole('link', { name: 'Mulai dengan Commerce Starter' }),
    ).toBeNull()
    expect(
      screen.getByRole('link', { name: 'Mulai dengan Company Starter' }),
    ).toBeTruthy()
  })

  it('shows loading, errors and a working retry', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 500 }))
      .mockResolvedValueOnce(response(packages))
    vi.stubGlobal('fetch', fetchMock)
    renderWithQuery(<SubscriptionForm isPending={false} onSubmit={vi.fn()} />)
    expect(screen.getByRole('status').textContent).toContain('Loading packages')
    await screen.findByRole('alert')
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    await screen.findByRole('button', { name: 'Commerce' })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('handles an empty catalog and prevents submission', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response([])))
    renderWithQuery(<SubscriptionForm isPending={false} onSubmit={vi.fn()} />)
    await screen.findByText(
      'No packages are available yet. Please check back later.',
    )
    expect(
      screen
        .getByRole('button', { name: 'Subscribe' })
        .hasAttribute('disabled'),
    ).toBe(true)
  })

  it('prevents submitting a package removed by a catalog refresh', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response(packages)))
    const onSubmit = vi.fn()
    const client = renderWithQuery(
      <SubscriptionForm isPending={false} onSubmit={onSubmit} />,
    )
    fireEvent.click(await screen.findByRole('button', { name: 'Commerce' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Select Commerce Starter' }),
    )
    client.setQueryData(
      ['tenant-packages'],
      packages.filter((pkg) => pkg.uuid !== starter.uuid),
    )
    await waitFor(() =>
      expect(
        screen
          .getByRole('button', { name: 'Subscribe' })
          .hasAttribute('disabled'),
      ).toBe(true),
    )
    fireEvent.submit(screen.getByRole('form', { name: 'Subscription package' }))
    await screen.findByRole('alert')
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
