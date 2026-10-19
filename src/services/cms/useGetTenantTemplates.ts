import { useQuery } from '@tanstack/react-query'

import type { TenantTemplateType } from '#/types/cms.type'
import type { ApiResponse } from '#/types/global.type'
import { fetchHelper } from '#/utils/fetchHelper'

export const useGetTenantTemplates = (tenantUuid?: string | null) => {
  return useQuery({
    queryKey: ['cms', 'tenant-templates', tenantUuid],
    enabled: Boolean(tenantUuid),
    queryFn: async () => {
      const query = tenantUuid ? { tenant_uuid: tenantUuid } : undefined
      const response = await fetchHelper<ApiResponse<Array<TenantTemplateType>>>(
        '/api/v1/dashboard/cms/tenant-template',
        { query },
      )
      return response.data ?? []
    },
  })
}
