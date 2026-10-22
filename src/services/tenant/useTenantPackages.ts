import type { UndefinedInitialDataOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import type { ApiResponse } from '#/types/global.type'
import type { TenantPackage } from '#/types/tenant.type'
import { fetchHelper } from '#/utils/fetchHelper'

export const useTenantPackages = (
  options?: Omit<UndefinedInitialDataOptions<Array<TenantPackage>>, 'queryKey'>,
) =>
  useQuery({
    ...options,
    queryKey: ['tenant-packages'],
    queryFn: async () => {
      const response = await fetchHelper<ApiResponse<Array<TenantPackage>>>(
        '/api/v1/portal/master/package',
      )
      return response.data ?? []
    },
  })
