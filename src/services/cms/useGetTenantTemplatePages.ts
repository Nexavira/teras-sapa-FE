import { useQuery } from '@tanstack/react-query'

import type { TenantTemplatePageType } from '#/types/cms.type'
import type { ApiResponse } from '#/types/global.type'
import { fetchHelper } from '#/utils/fetchHelper'

export const useGetTenantTemplatePages = (
  tenantTemplateUuid?: string | null,
) => {
  return useQuery({
    queryKey: ['cms', 'tenant-template-pages', tenantTemplateUuid],
    enabled: Boolean(tenantTemplateUuid),
    queryFn: async () => {
      const query = tenantTemplateUuid
        ? { tenant_template_uuid: tenantTemplateUuid }
        : undefined
      const response = await fetchHelper<
        ApiResponse<Array<TenantTemplatePageType>>
      >('/api/v1/dashboard/cms/tenant-template-page', { query })
      return response.data ?? []
    },
  })
}
