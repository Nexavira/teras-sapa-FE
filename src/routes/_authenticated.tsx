import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

// import { authClient } from '#/integrations/better-auth/client'

const AuthenticatedLayout = () => {
  return <Outlet />
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    try {
      // const { data: session } = await authClient.getSession()
      const session = true
      if (!session) {
        throw redirect({
          to: '/login',
        })
      }
      return { session }
    } catch (err) {
      if (err && typeof err === 'object' && 'to' in err) {
        throw err
      }
    }
  },
  component: AuthenticatedLayout,
})
