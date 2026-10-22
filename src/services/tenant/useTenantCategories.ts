import type { UndefinedInitialDataOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import type { ApiResponse } from '#/types/global.type'
import type { TenantCategory } from '#/types/tenant.type'
import { fetchHelper } from '#/utils/fetchHelper'

export const useTenantCategories = (
  options?: Omit<
    UndefinedInitialDataOptions<Array<TenantCategory>>,
    'queryKey'
  >,
) =>
  useQuery({
    ...options,
    queryKey: ['tenant-categories'],
    queryFn: async () => {
      const response = await fetchHelper<ApiResponse<Array<TenantCategory>>>(
        '/api/v1/portal/tenant/categories',
      )
      return response.data ?? []
    },
  })
