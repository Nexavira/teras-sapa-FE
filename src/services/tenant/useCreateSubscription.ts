import { useMutation } from '@tanstack/react-query'

import type { CreateSubscriptionBody } from '#/routes/_authenticated/admin/-utils/subscription-schema'
import type { ApiResponse } from '#/types/global.type'
import type { CurrentTenantPayment } from '#/types/tenant.type'
import { fetchHelper } from '#/utils/fetchHelper'

export const useCreateSubscription = () =>
  useMutation({
    mutationFn: async (body: CreateSubscriptionBody) => {
      const response = await fetchHelper<
        ApiResponse<CurrentTenantPayment>,
        CreateSubscriptionBody
      >('/api/v1/portal/tenant/subscription', { method: 'POST', body })
      if (!response.data)
        throw new Error(
          response.message || 'The subscription payment was not returned.',
        )
      return response.data
    },
  })
