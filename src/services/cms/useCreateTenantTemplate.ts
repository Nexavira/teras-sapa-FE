import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CreateTenantTemplateBody } from '#/routes/_authenticated/admin/themes/-utils/-install-theme-schema'
import type { TenantTemplateType } from '#/types/cms.type'
import type { ApiResponse } from '#/types/global.type'
import { fetchHelper } from '#/utils/fetchHelper'

export const useCreateTenantTemplate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: CreateTenantTemplateBody) => {
      const response = await fetchHelper<
        ApiResponse<TenantTemplateType>,
        CreateTenantTemplateBody
      >('/api/v1/dashboard/cms/tenant-template/create', {
        method: 'POST',
        body,
      })
      if (!response.data) {
        throw new Error(
          response.message || 'Gagal menyimpan tema toko ke server.',
        )
      }
      return response.data
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['cms', 'tenant-templates', variables.tenant_uuid],
      })
      void queryClient.invalidateQueries({
        queryKey: ['cms', 'tenant-templates'],
      })
    },
  })
}
