import { isRedirect } from '@tanstack/react-router'

import { beforeEach, describe, expect, it } from 'vitest'

import { requireAuthentication, Route } from './_authenticated'

const AUTH_TOKEN_KEY = 'teras_sapa_access_token'

describe('authenticated route middleware', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('redirects unauthenticated visitors to login', () => {
    try {
      requireAuthentication()
      throw new Error('Expected authentication middleware to redirect')
    } catch (error) {
      expect(isRedirect(error)).toBe(true)

      if (isRedirect(error)) {
        expect(error.options.to).toBe('/login')
      }
    }
  })

  it('allows visitors with an authentication token', () => {
    window.localStorage.setItem(AUTH_TOKEN_KEY, 'access-token')

    expect(requireAuthentication()).toEqual({ isAuthenticated: true })
  })

  it('disables SSR so localStorage is checked before rendering admin pages', () => {
    expect(Route.options.ssr).toBe(false)
  })
})
