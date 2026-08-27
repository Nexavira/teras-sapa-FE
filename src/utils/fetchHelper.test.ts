import { afterEach, describe, expect, it, vi } from 'vitest'

import { env } from '#/env'

import type { FetchError } from './fetchHelper'
import { fetchHelper } from './fetchHelper'

const jsonResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })

describe('fetchHelper', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('builds an API URL with query parameters', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse({ items: [] }))
    vi.stubGlobal('fetch', fetchMock)

    await fetchHelper('/products', {
      query: { page: 2, status: ['active', 'draft'], search: undefined },
    })

    expect(fetchMock).toHaveBeenCalledWith(
      `${env.VITE_API_URL.replace(/\/+$/, '')}/products?page=2&status=active&status=draft`,
      expect.objectContaining({ credentials: 'include' }),
    )
  })

  it('serializes object bodies as JSON', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse({ id: 1 }))
    vi.stubGlobal('fetch', fetchMock)

    await fetchHelper('/products', {
      method: 'POST',
      body: { name: 'Coffee' },
    })

    const request = fetchMock.mock.calls[0]?.[1]
    expect(request?.body).toBe('{"name":"Coffee"}')
    expect(new Headers(request?.headers).get('Content-Type')).toBe(
      'application/json',
    )
  })

  it('throws a structured FetchError for unsuccessful responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(
          jsonResponse(
            { message: 'Product not found' },
            { status: 404, statusText: 'Not Found' },
          ),
        ),
    )

    await expect(fetchHelper('/products/404')).rejects.toMatchObject<
      Partial<FetchError>
    >({
      name: 'FetchError',
      message: 'Product not found',
      status: 404,
      data: { message: 'Product not found' },
    })
  })

  it('supports successful responses without a body', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(new Response(null, { status: 204 })),
    )

    await expect(fetchHelper('/session', { method: 'DELETE' })).resolves.toBe(
      undefined,
    )
  })
})
