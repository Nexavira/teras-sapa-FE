import { createFileRoute, Outlet } from '@tanstack/react-router'

import { AdminLayout } from '#/components/ui/layout/AdminLayout'

export const Route = createFileRoute('/_authenticated/admin')({
  component: AdminLayoutRoute,
})

const AdminLayoutRoute = () => {
  return (
    <AdminLayout storeName="My Store">
      <Outlet />
    </AdminLayout>
  )
}
