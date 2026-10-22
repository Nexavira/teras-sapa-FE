import { useQuery } from '@tanstack/react-query'

import type { GlobalTemplateType } from '#/types/cms.type'
import type { ApiResponse } from '#/types/global.type'
import { fetchHelper } from '#/utils/fetchHelper'

export const useGetGlobalTemplates = () => {
  return useQuery({
    queryKey: ['cms', 'global-templates'],
    queryFn: async () => {
      const response = await fetchHelper<
        ApiResponse<Array<GlobalTemplateType>>
      >('/api/v1/portal/cms/global-template')
      return response.data ?? []
    },
  })
}
