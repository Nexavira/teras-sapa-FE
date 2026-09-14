import { useQuery } from '@tanstack/react-query'

import type { ApiResponse } from '#/types/global.type'
import type { CurrentTenantPayment } from '#/types/tenant.type'
import { fetchHelper } from '#/utils/fetchHelper'

export const useCurrentPayment = (userUuid?: string, tenantUuid?: string) =>
  useQuery({
    queryKey: ['current-payment', userUuid, tenantUuid],
    enabled: Boolean(userUuid && tenantUuid),
    refetchInterval: 5000,
    queryFn: async () => {
      const response = await fetchHelper<
        ApiResponse<CurrentTenantPayment | null>
      >(
        `/api/v1/portal/tenant/current-payment/${encodeURIComponent(tenantUuid!)}`,
      )
      return response.data ?? null
    },
  })
