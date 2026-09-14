import { useMutation } from '@tanstack/react-query'

import type { CreateTenantBody } from '#/routes/_authenticated/admin/-utils/tenant-schema'
import type { ApiResponse } from '#/types/global.type'
import type { CreatedTenant, TenantType } from '#/types/tenant.type'
import { fetchHelper } from '#/utils/fetchHelper'

const useCreateTenant = () => {
  return useMutation({
    mutationFn: async (body: CreateTenantBody) => {
      const response = await fetchHelper<
        ApiResponse<TenantType | CreatedTenant>,
        CreateTenantBody
      >('/api/v1/portal/tenant', { method: 'POST', body })
      if (!response.data)
        throw new Error(
          response.message || 'Data website yang dibuat belum diterima.',
        )
      return 'tenant' in response.data ? response.data.tenant : response.data
    },
  })
}

export default useCreateTenant
