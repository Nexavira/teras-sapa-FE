import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { UpdateTenantTemplatePageBody } from '#/routes/_authenticated/admin/themes/-utils/-update-page-schema'
import type { TenantTemplatePageType } from '#/types/cms.type'
import type { ApiResponse } from '#/types/global.type'
import { fetchHelper } from '#/utils/fetchHelper'

export const useUpdateTenantTemplatePage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: UpdateTenantTemplatePageBody) => {
      const response = await fetchHelper<
        ApiResponse<TenantTemplatePageType>,
        UpdateTenantTemplatePageBody
      >('/api/v1/dashboard/cms/tenant-template-page/update', {
        method: 'PATCH',
        body,
      })
      if (!response.data) {
        throw new Error(
          response.message || 'Gagal memperbarui data halaman di server.',
        )
      }
      return response.data
    },
    onSuccess: (data) => {
      if (data.tenant_template?.uuid) {
        void queryClient.invalidateQueries({
          queryKey: ['cms', 'tenant-template-pages', data.tenant_template.uuid],
        })
      }
      void queryClient.invalidateQueries({
        queryKey: ['cms', 'tenant-templates'],
      })
    },
  })
}
