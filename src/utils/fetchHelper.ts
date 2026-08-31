import { env } from '#/env'
import { getAuthToken } from '#/services/auth/authStorage'

type QueryValue = string | number | boolean | null | undefined

export type FetchQuery = Record<string, QueryValue | Array<QueryValue>>

export interface FetchHelperOptions<TBody = unknown> extends Omit<
  RequestInit,
  'body'
> {
  body?: TBody | BodyInit | null
  query?: FetchQuery
}

export class FetchError<TData = unknown> extends Error {
  readonly status: number
  readonly statusText: string
  readonly data: TData

  constructor(
    message: string,
    options: { status: number; statusText: string; data: TData },
  ) {
    super(message)
    this.name = 'FetchError'
    this.status = options.status
    this.statusText = options.statusText
    this.data = options.data
  }
}

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value)

const buildUrl = (endpoint: string, query?: FetchQuery) => {
  const baseUrl = env.VITE_API_URL.replace(/\/+$/, '')
  const normalizedEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`
  const url = new URL(
    isAbsoluteUrl(endpoint) ? endpoint : `${baseUrl}${normalizedEndpoint}`,
  )

  Object.entries(query ?? {}).forEach(([key, rawValue]) => {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue]

    values.forEach((value) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
  })

  return url.toString()
}

const isBodyInit = (body: unknown): body is BodyInit =>
  typeof body === 'string' ||
  body instanceof Blob ||
  body instanceof FormData ||
  body instanceof URLSearchParams ||
  body instanceof ArrayBuffer ||
  ArrayBuffer.isView(body) ||
  body instanceof ReadableStream

const getResponseData = async (response: Response): Promise<unknown> => {
  if (response.status === 204 || response.status === 205) return undefined

  const text = await response.text()
  if (!text) return undefined

  const contentType = response.headers.get('content-type')
  if (contentType?.includes('json')) {
    try {
      return JSON.parse(text) as unknown
    } catch {
      return text
    }
  }

  return text
}

const getErrorMessage = (data: unknown, response: Response) => {
  if (data && typeof data === 'object') {
    const errorData = data as { error?: unknown; message?: unknown }

    if (typeof errorData.message === 'string') return errorData.message
    if (errorData.message && typeof errorData.message === 'object') {
      const validationMessage = Object.values(errorData.message)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .find((value): value is string => typeof value === 'string')

      if (validationMessage) return validationMessage
    }
    if (typeof errorData.error === 'string') return errorData.error
  }

  if (typeof data === 'string' && data) return data
  return response.statusText || 'API request failed'
}

export async function fetchHelper<TResponse, TBody = unknown>(
  endpoint: string,
  options: FetchHelperOptions<TBody> = {},
): Promise<TResponse> {
  const { body, headers: customHeaders, query, ...requestOptions } = options
  const headers = new Headers(customHeaders)
  let requestBody: BodyInit | null | undefined

  headers.set('Accept', headers.get('Accept') ?? 'application/json')

  const token = getAuthToken()
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (body !== undefined && body !== null) {
    if (isBodyInit(body)) {
      requestBody = body
    } else {
      headers.set(
        'Content-Type',
        headers.get('Content-Type') ?? 'application/json',
      )
      requestBody = JSON.stringify(body)
    }
  } else {
    requestBody = body === null ? null : undefined
  }

  const response = await fetch(buildUrl(endpoint, query), {
    ...requestOptions,
    body: requestBody,
    headers,
  })
  const data = await getResponseData(response)

  if (!response.ok) {
    throw new FetchError(getErrorMessage(data, response), {
      status: response.status,
      statusText: response.statusText,
      data,
    })
  }

  return data as TResponse
}
