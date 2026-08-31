import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { hasAuthToken } from '#/services/auth/authStorage'

const AuthenticatedLayout = () => {
  return <Outlet />
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && !hasAuthToken()) {
      throw redirect({
        to: '/login',
      })
    }

    return { isAuthenticated: hasAuthToken() }
  },
  component: AuthenticatedLayout,
})
