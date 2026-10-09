import { useGetUserSession } from '#/services/auth/useGetUserSession'
import type { TenantType } from '#/types/tenant.type'

export const useGetCurrentTenant = () => {
  const session = useGetUserSession()
  const tenants = session.data?.user?.tenants
  const tenant: TenantType | null = Array.isArray(tenants)
    ? (tenants.at(0) ?? null)
    : null

  return {
    ...session,
    tenant,
    data: tenant,
    isSuspended: Boolean(tenant?.is_suspended),
  }
}
