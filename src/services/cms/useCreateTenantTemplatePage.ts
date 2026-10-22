import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CreateTenantTemplatePageBody } from '#/routes/_authenticated/admin/themes/-utils/-create-page-schema'
import type { TenantTemplatePageType } from '#/types/cms.type'
import type { ApiResponse } from '#/types/global.type'
import { fetchHelper } from '#/utils/fetchHelper'

export const useCreateTenantTemplatePage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: CreateTenantTemplatePageBody) => {
      const response = await fetchHelper<
        ApiResponse<TenantTemplatePageType>,
        CreateTenantTemplatePageBody
      >('/api/v1/dashboard/cms/tenant-template-page/create', {
        method: 'POST',
        body,
      })
      if (!response.data) {
        throw new Error(
          response.message || 'Gagal membuat halaman toko di server.',
        )
      }
      return response.data
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [
          'cms',
          'tenant-template-pages',
          variables.tenant_template_uuid,
        ],
      })
      void queryClient.invalidateQueries({
        queryKey: ['cms', 'tenant-templates'],
      })
    },
  })
}
