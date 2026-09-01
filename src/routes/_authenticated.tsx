import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { hasAuthToken } from '#/services/auth/authStorage'

const AuthenticatedLayout = () => {
  return <Outlet />
}

export const requireAuthentication = () => {
  // if (!hasAuthToken()) {
  //   throw redirect({
  //     to: '/login',
  //   })
  // }

  return { isAuthenticated: true }
}

export const Route = createFileRoute('/_authenticated')({
  // Authentication is stored in localStorage, so this route must be resolved
  // in the browser before any protected child (such as /admin) is rendered.
  ssr: false,
  beforeLoad: requireAuthentication,
  component: AuthenticatedLayout,
})
