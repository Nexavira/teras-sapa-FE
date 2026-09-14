import { useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '#/constant'
import type { SessionUserType } from '#/types/session-user.type'

import { CreateTenantModal } from '../-schema/CreateTenantModal'
import { SubscriptionModal } from '../-schema/SubscriptionModal'

export const TenantOnboarding = ({ user }: { user: SessionUserType }) => {
  const queryClient = useQueryClient()
  const [createdTenant, setCreatedTenant] = useState<
    SessionUserType['tenants'][number] | null
  >(null)
  const tenant =
    user.tenants.find((item) => item.active_subscription) ??
    user.tenants.at(0) ??
    createdTenant
  const refresh = () => {
    void queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.AUTH_USER_SESSION],
    })
  }
  useEffect(() => {
    if (!tenant || tenant.active_subscription) return
    const timer = setInterval(() => {
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.AUTH_USER_SESSION],
      })
    }, 5000)
    return () => clearInterval(timer)
  }, [tenant, queryClient])
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
  // if (!tenant.active_subscription)
  //   return (
  //     <SubscriptionModal
  //       key={tenant.uuid}
  //       tenant={tenant}
  //       userUuid={user.uuid}
  //       onRefresh={refresh}
  //     />
  //   )
  return null
}
