import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '#/constant'
import type { ApiResponse } from '#/types/global.type'
import type { SessionUserType } from '#/types/session-user.type'
import { fetchHelper } from '#/utils/fetchHelper'

export const useGetUserSession = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.AUTH_USER_SESSION],
    queryFn: async () => {
      const response = await fetchHelper<ApiResponse<SessionUserType>>(
        '/api/v1/portal/auth/user-session-information',
      )

      return { user: response.data }
    },
  })
}
