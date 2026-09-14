import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ThemeProvider } from '#/-components/ui/ThemeProvider'
import type { SessionUserType } from '#/types/session-user.type'

import { TenantOnboarding } from '../-components/TenantOnboarding'
import { CreateTenantModal, createTenantSlug } from './CreateTenantModal'
import { PaymentProofForm } from './PaymentProofForm'
import { SubscriptionModal } from './SubscriptionModal'

const tenant = {
  uuid: 'tenant-uuid',
  name: 'Kopi Kita',
  slug: 'kopi-kita',
  is_suspended: false,
  active_subscription: null,
}
const payment = {
  uuid: 'payment-uuid',
  amount_due: '150000',
  status: 'unpaid',
  due_date: '2026-09-14',
}
const transfer_instructions = {
  available: true,
  currency: 'IDR',
  bank_name: 'Test Bank',
  account_number: '123456',
  account_holder: 'Shopiti',
  reference: 'INV-123',
}
const pending = { payment, transfer_instructions }
const user: SessionUserType = {
  uuid: 'user-uuid',
  email: 'test@example.com',
  name: null,
  photo: null,
  role: { uuid: null, name: null },
  user_information: { name: null, phone_number: null },
  tenants: [],
}
const response = (data: unknown) =>
  new Response(JSON.stringify({ success: true, data }), {
    headers: { 'Content-Type': 'application/json' },
  })
const renderForm = (children: ReactNode) =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: {
            mutations: { retry: false },
            queries: { retry: false },
          },
        })
      }
    >
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>,
  )
const mockApi = (websiteTypes = ['commerce']) => {
  const mock = vi.fn<typeof fetch>().mockImplementation(async (url) => {
    const path = String(url)
    if (path.endsWith('/master/package'))
      return response(
        websiteTypes.map((websiteType, index) => ({
          uuid: index === 0 ? 'package-uuid' : `package-${index}`,
          title: 'Starter',
          tier: 'basic',
          website_type: websiteType,
          description: 'Your first online store.',
          price_prefix: '',
          price: '150000',
          original_price: '200000',
          price_suffix: '/bulan',
          trial_days: 7,
          features: [{ text: 'Store templates', is_highlighted: true }],
          billing_cycle: 'monthly',
        })),
      )
    if (path.endsWith('/tenant/categories'))
      return response([{ uuid: 'cat-uuid', name: 'Food and drink' }])
    if (path.includes('/current-payment/')) return response(null)
    if (path.endsWith('/tenant/subscription')) return response(pending)
    if (path.endsWith('/tenant')) return response(tenant)
    return response({ ...payment, status: 'pending_verification' })
  })
  vi.stubGlobal('fetch', mock)
  return mock
}
const fillDetails = async () => {
  fireEvent.change(await screen.findByLabelText('Nama website'), {
    target: { value: 'Kopi Kita' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Lanjutkan' }))
  fireEvent.click(await screen.findByRole('button', { name: 'Food and drink' }))
  fireEvent.click(screen.getByRole('button', { name: 'Lanjutkan' }))
  await screen.findByRole('heading', {
    name: 'Siap memulai langkah pertamamu?',
  })
}
const createStore = async () => {
  await fillDetails()
  fireEvent.click(await screen.findByRole('button', { name: 'Toko online' }))
  fireEvent.click(screen.getByRole('button', { name: 'Pilih Starter' }))
  fireEvent.click(screen.getByRole('button', { name: 'Buat website saya' }))
}
const selectProof = (
  file = new File(['receipt'], 'receipt.png', { type: 'image/png' }),
) => {
  fireEvent.change(screen.getByLabelText('Payment proof'), {
    target: { files: [file] },
  })
  fireEvent.submit(screen.getByLabelText('Payment proof').closest('form')!)
  return file
}

describe('Tenant onboarding', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    )
  })
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })
  it('creates a URL-safe slug', () =>
    expect(createTenantSlug('  Kopi & Crème Jakarta  ')).toBe(
      'kopi-creme-jakarta',
    ))
  it('shows only tenant creation for an account without tenants', async () => {
    mockApi()
    renderForm(<TenantOnboarding user={user} />)
    expect(screen.getByRole('dialog').getAttribute('aria-labelledby')).toBe(
      'onboarding-title',
    )
    await screen.findByLabelText('Nama website')
    expect(screen.queryByLabelText('Subscription package')).toBeNull()
  })
  it('validates details before advancing and preserves them when going back', async () => {
    mockApi()
    renderForm(<CreateTenantModal isOpen onCreated={vi.fn()} />)
    fireEvent.submit(screen.getByLabelText('Nama website').closest('form')!)
    await screen.findByText('Nama website perlu diisi dulu, ya.')
    expect(screen.queryByRole('button', { name: 'Toko online' })).toBeNull()
    await fillDetails()
    fireEvent.click(screen.getByRole('button', { name: '← Kembali' }))
    expect(
      screen
        .getByRole('button', { name: 'Food and drink' })
        .getAttribute('aria-pressed'),
    ).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: '← Kembali' }))
    expect(
      screen.getByRole<HTMLInputElement>('textbox', { name: 'Nama website' })
        .value,
    ).toBe('Kopi Kita')
    expect(
      screen.getByRole<HTMLInputElement>('textbox', { name: 'URL website' })
        .value,
    ).toBe('kopi-kita')
  })
  it('shows detailed packages and clears selection when the website type changes', async () => {
    mockApi(['commerce', 'portfolio'])
    renderForm(<CreateTenantModal isOpen onCreated={vi.fn()} />)
    await fillDetails()
    fireEvent.click(screen.getByRole('button', { name: 'Toko online' }))
    expect(screen.getByText('Your first online store.')).toBeTruthy()
    expect(screen.getByText('Store templates')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Pilih Starter' }))
    expect(
      screen
        .getByRole('button', { name: 'Terpilih' })
        .getAttribute('aria-pressed'),
    ).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Portofolio' }))
    expect(screen.queryByRole('button', { name: 'Terpilih' })).toBeNull()
    expect(
      screen
        .getByRole('button', { name: 'Buat website saya' })
        .hasAttribute('disabled'),
    ).toBe(true)
  })
  it('asks for a business category before showing plans', async () => {
    mockApi()
    renderForm(<CreateTenantModal isOpen onCreated={vi.fn()} />)
    expect(screen.queryByRole('group', { name: 'Kategori website' })).toBeNull()
    fireEvent.change(screen.getByLabelText('Nama website'), {
      target: { value: 'Kopi Kita' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Lanjutkan' }))
    const heading = await screen.findByRole('heading', {
      name: 'Kopi Kita akan membahas apa?',
    })
    expect(document.activeElement).toBe(heading)
    fireEvent.click(screen.getByRole('button', { name: 'Lanjutkan' }))
    await screen.findByText(
      'Pilih kategori yang paling sesuai dengan website kamu.',
    )
    expect(screen.queryByRole('group', { name: 'Jenis website' })).toBeNull()
  })
  it('preserves a custom URL when the store name changes', async () => {
    mockApi()
    renderForm(<CreateTenantModal isOpen onCreated={vi.fn()} />)
    fireEvent.change(screen.getByLabelText('Nama website'), {
      target: { value: 'Kopi Kita' },
    })
    fireEvent.change(screen.getByLabelText('URL website'), {
      target: { value: 'our-coffee' },
    })
    fireEvent.change(screen.getByLabelText('Nama website'), {
      target: { value: 'Kopi Baru' },
    })
    expect(
      screen.getByRole<HTMLInputElement>('textbox', { name: 'URL website' })
        .value,
    ).toBe('our-coffee')
    fireEvent.click(screen.getByRole('button', { name: 'Lanjutkan' }))
    await screen.findByRole('heading', {
      name: 'Kopi Baru akan membahas apa?',
    })
    fireEvent.click(screen.getByRole('button', { name: '← Kembali' }))
    expect(
      screen.getByRole<HTMLInputElement>('textbox', { name: 'URL website' })
        .value,
    ).toBe('our-coffee')
  })
  it('lets the user retry a failed category lookup', async () => {
    const mock = mockApi()
    const implementation = mock.getMockImplementation()!
    let categoryAttempts = 0
    mock.mockImplementation(async (...args) => {
      if (
        String(args[0]).endsWith('/tenant/categories') &&
        categoryAttempts++ === 0
      ) {
        return new Response('', { status: 500 })
      }
      return implementation(...args)
    })
    renderForm(<CreateTenantModal isOpen onCreated={vi.fn()} />)
    fireEvent.change(screen.getByLabelText('Nama website'), {
      target: { value: 'Kopi Kita' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Lanjutkan' }))
    await screen.findByText('Kategori website belum berhasil dimuat.')
    expect(
      screen
        .getByRole('button', { name: 'Lanjutkan' })
        .hasAttribute('disabled'),
    ).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Coba lagi' }))
    fireEvent.click(
      await screen.findByRole('button', { name: 'Food and drink' }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Lanjutkan' }))
    await screen.findByRole('heading', {
      name: 'Siap memulai langkah pertamamu?',
    })
  })
  it('keeps the selected plan after creation fails and allows retrying', async () => {
    const mock = mockApi()
    const implementation = mock.getMockImplementation()!
    let createAttempts = 0
    mock.mockImplementation(async (...args) => {
      if (
        String(args[0]).endsWith('/tenant') &&
        args[1]?.method === 'POST' &&
        createAttempts++ === 0
      ) {
        return new Response(
          JSON.stringify({ message: 'Please try creating your store again.' }),
          { status: 500 },
        )
      }
      return implementation(...args)
    })
    const onCreated = vi.fn()
    renderForm(<CreateTenantModal isOpen onCreated={onCreated} />)
    await createStore()
    await screen.findByRole('alert')
    expect(onCreated).not.toHaveBeenCalled()
    expect(
      screen
        .getByRole('button', { name: 'Terpilih' })
        .getAttribute('aria-pressed'),
    ).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Buat website saya' }))
    await vi.waitFor(() => expect(onCreated).toHaveBeenCalledWith(tenant))
    expect(createAttempts).toBe(2)
  })
  it('retries the packages endpoint after a lookup fails', async () => {
    const mock = mockApi()
    mock.mockResolvedValueOnce(new Response('', { status: 500 }))
    renderForm(<CreateTenantModal isOpen onCreated={vi.fn()} />)
    await fillDetails()
    await screen.findByText('Pilihan paket belum berhasil dimuat.')
    fireEvent.click(screen.getByRole('button', { name: 'Coba lagi' }))
    await screen.findByRole('button', { name: 'Toko online' })
    expect(
      mock.mock.calls.filter(([url]) =>
        String(url).endsWith('/master/package'),
      ),
    ).toHaveLength(2)
  })
  it('creates the tenant with required backend fields then switches to subscription setup', async () => {
    const mock = mockApi()
    renderForm(<TenantOnboarding user={user} />)
    await createStore()
    await screen.findByRole('heading', { name: 'Activate your subscription' })
    expect(screen.queryByLabelText('Nama website')).toBeNull()
    const call = mock.mock.calls.find(
      ([url, options]) =>
        String(url).endsWith('/tenant') && options?.method === 'POST',
    )!
    expect(JSON.parse(call[1]!.body as string)).toEqual({
      name: 'Kopi Kita',
      slug: 'kopi-kita',
      tenant_category_uuid: 'cat-uuid',
      package_uuid: 'package-uuid',
      global_template_uuid: '',
      is_suspended: 0,
      is_trial: 1,
    })
  })
  it('shows subscription setup for an existing tenant and never recreates the store', async () => {
    const mock = mockApi()
    renderForm(<TenantOnboarding user={{ ...user, tenants: [tenant] }} />)
    fireEvent.click(await screen.findByRole('button', { name: 'Commerce' }))
    expect(screen.queryByLabelText('Nama website')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Select Starter' }))
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
    await screen.findByLabelText('Payment proof')
    const posts = mock.mock.calls.filter(
      ([, options]) => options?.method === 'POST',
    )
    expect(posts).toHaveLength(1)
    expect(String(posts[0][0])).toMatch(/tenant\/subscription$/)
    expect(JSON.parse(posts[0][1]!.body as string)).toEqual({
      package_uuid: 'package-uuid',
      tenant_uuid: 'tenant-uuid',
      is_trial: 0,
    })
  })
  it('shows neither modal when a tenant has an active subscription', () => {
    const mock = mockApi()
    renderForm(
      <TenantOnboarding
        user={{
          ...user,
          tenants: [
            { ...tenant, active_subscription: { uuid: 'subscription-uuid' } },
          ],
        }}
      />,
    )
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(mock).not.toHaveBeenCalled()
  })
  it('accepts an active subscription on another existing tenant', () => {
    mockApi()
    renderForm(
      <TenantOnboarding
        user={{
          ...user,
          tenants: [
            tenant,
            {
              ...tenant,
              uuid: 'second',
              active_subscription: { uuid: 'subscription-uuid' },
            },
          ],
        }}
      />,
    )
    expect(screen.queryByRole('dialog')).toBeNull()
  })
  it('resumes pending verification without offering another subscription or upload', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(
        response({
          ...pending,
          payment: { ...payment, status: 'pending_verification' },
        }),
      ),
    )
    renderForm(
      <SubscriptionModal
        tenant={tenant}
        userUuid={user.uuid}
        onRefresh={vi.fn()}
      />,
    )
    await screen.findByText(/Payment proof received/)
    expect(screen.queryByLabelText('Payment proof')).toBeNull()
    expect(screen.queryByLabelText('Subscription package')).toBeNull()
  })
  it('keeps payment lookup errors separate from a missing subscription payment', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(new Response('', { status: 500 })),
    )
    renderForm(
      <SubscriptionModal
        tenant={tenant}
        userUuid={user.uuid}
        onRefresh={vi.fn()}
      />,
    )
    await screen.findByRole('alert')
    expect(screen.queryByRole('button', { name: 'Subscribe' })).toBeNull()
  })
  it('uploads multipart payment proof from the separate payment form', async () => {
    const mock = mockApi()
    renderForm(<PaymentProofForm payment={pending} onRefresh={vi.fn()} />)
    const file = selectProof()
    await screen.findByRole('status')
    const body = mock.mock.calls[0][1]!.body as FormData
    expect(body.get('_method')).toBe('PATCH')
    expect(body.get('amount_paid')).toBe('150000')
    expect(body.get('proof_of_payment')).toBe(file)
    expect(
      new Headers(mock.mock.calls[0][1]!.headers).has('Content-Type'),
    ).toBe(false)
  })
  it('rejects unsupported payment files without making a request', async () => {
    const mock = mockApi()
    renderForm(<PaymentProofForm payment={pending} onRefresh={vi.fn()} />)
    selectProof(new File(['bad'], 'file.txt', { type: 'text/plain' }))
    await screen.findByRole('alert')
    expect(mock).not.toHaveBeenCalled()
  })
  it('does not render tenant creation when closed', () => {
    const mock = mockApi()
    renderForm(<CreateTenantModal isOpen={false} onCreated={vi.fn()} />)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(mock).not.toHaveBeenCalled()
  })
})
