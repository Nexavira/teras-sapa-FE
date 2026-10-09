import { useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '#/constant'
import type { SessionUserType } from '#/types/session-user.type'
import type { TenantType } from '#/types/tenant.type'

import { CreateTenantModal } from '../-schema/CreateTenantModal'
import { SubscriptionModal } from '../-schema/SubscriptionModal'

export const TenantOnboarding = ({ user }: { user: SessionUserType }) => {
  const queryClient = useQueryClient()
  const [createdTenant, setCreatedTenant] = useState<TenantType | null>(null)

  // Status payment didapat dari user session pada key tenants.
  // Di tenant yang sedang digunakan ada key is_suspended:
  // true  -> belum ada payment (unpaid / suspended)
  // false -> sudah payment (paid / active)
  const tenant = user.tenants.at(0) ?? createdTenant
  const isSuspended = Boolean(tenant?.is_suspended)

  const refresh = () => {
    void queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.AUTH_USER_SESSION],
    })
  }

  useEffect(() => {
    if (!isSuspended) return
    const timer = setInterval(() => {
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.AUTH_USER_SESSION],
      })
    }, 5000)
    return () => clearInterval(timer)
  }, [isSuspended, queryClient])

  if (!tenant)
    return (
      <CreateTenantModal
        isOpen
        onCreated={(created) => {
          setCreatedTenant(created)
          refresh()
        }}
      />
    )

  if (isSuspended)
    return (
      <SubscriptionModal
        key={tenant.uuid}
        tenant={tenant}
        userUuid={user.uuid}
        onRefresh={refresh}
      />
    )

  return null
}
