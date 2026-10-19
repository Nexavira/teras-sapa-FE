import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { TenantTemplateType } from '#/types/cms.type'
import type { ApiResponse } from '#/types/global.type'
import { fetchHelper } from '#/utils/fetchHelper'

interface ChangeActiveVariables {
  tenantSlug: string
  tenantTemplateUuid: string
  active: boolean
}

export const useChangeActiveTenantTemplate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      tenantSlug,
      tenantTemplateUuid,
      active,
    }: ChangeActiveVariables) => {
      const response = await fetchHelper<ApiResponse<TenantTemplateType>>(
        `/api/v1/t/${tenantSlug}/cms/tenant-template/change-active/${tenantTemplateUuid}`,
        {
          method: 'PATCH',
          body: { active_template: active },
        },
      )
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['cms', 'tenant-templates'],
      })
    },
  })
}
