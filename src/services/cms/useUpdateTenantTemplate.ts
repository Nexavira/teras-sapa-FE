import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { UpdateTenantTemplateBody } from '#/routes/_authenticated/admin/themes/-utils/-update-template-schema'
import type { TenantTemplateType } from '#/types/cms.type'
import type { ApiResponse } from '#/types/global.type'
import { fetchHelper } from '#/utils/fetchHelper'

export const useUpdateTenantTemplate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: UpdateTenantTemplateBody) => {
      const response = await fetchHelper<
        ApiResponse<TenantTemplateType>,
        UpdateTenantTemplateBody
      >('/api/v1/dashboard/cms/tenant-template/update', {
        method: 'PATCH',
        body,
      })
      if (!response.data) {
        throw new Error(
          response.message || 'Gagal memperbarui pengaturan tema di server.',
        )
      }
      return response.data
    },
    onSuccess: (data) => {
      if (data.tenant?.uuid) {
        void queryClient.invalidateQueries({
          queryKey: ['cms', 'tenant-templates', data.tenant.uuid],
        })
      }
      void queryClient.invalidateQueries({
        queryKey: ['cms', 'tenant-templates'],
      })
    },
  })
}
