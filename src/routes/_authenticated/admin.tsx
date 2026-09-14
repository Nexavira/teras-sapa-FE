import { createFileRoute, Outlet } from '@tanstack/react-router'

import { AdminLayout } from '#/-components/ui/layout/AdminLayout'
import { useGetUserSession } from '#/services/auth/useGetUserSession'

import { TenantOnboarding } from './admin/-components/TenantOnboarding'

const AdminLayoutRoute = () => {
  const session = useGetUserSession()
  if (session.isPending) return <p role="status">Loading your store…</p>
  if (session.isError || !session.data.user)
    return (
      <div role="alert">
        Could not load your account.{' '}
        <button type="button" onClick={() => void session.refetch()}>
          Retry
        </button>
      </div>
    )
  const user = session.data.user
  return (
    <AdminLayout
      storeName={
        (
          user.tenants.find((tenant) => tenant.active_subscription) ??
          user.tenants.at(0)
        )?.name ?? 'My Store'
      }
    >
      <Outlet />
      <TenantOnboarding key={user.uuid} user={user} />
    </AdminLayout>
  )
}

export const Route = createFileRoute('/_authenticated/admin')({
  component: AdminLayoutRoute,
})
