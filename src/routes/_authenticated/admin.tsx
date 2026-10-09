import { createFileRoute, Outlet } from '@tanstack/react-router'

import { AdminLayout } from '#/-components/ui/layout/AdminLayout'
import { useGetUserSession } from '#/services/auth/useGetUserSession'
import { useGetCurrentTenant } from '#/services/tenant/useGetCurrentTenant'

import { TenantOnboarding } from './admin/-components/TenantOnboarding'

const AdminLayoutRoute = () => {
  const session = useGetUserSession()
  const { tenant } = useGetCurrentTenant()

  if (session.isPending) return <p role="status">Memuat toko Anda…</p>
  if (session.isError || !session.data.user)
    return (
      <div role="alert">
        Gagal memuat akun Anda.{' '}
        <button type="button" onClick={() => void session.refetch()}>
          Coba lagi
        </button>
      </div>
    )
  const user = session.data.user
  return (
    <AdminLayout storeName={tenant?.name ?? 'Toko Saya'}>
      <Outlet />
      <TenantOnboarding key={user.uuid} user={user} />
    </AdminLayout>
  )
}

export const Route = createFileRoute('/_authenticated/admin')({
  component: AdminLayoutRoute,
})
