import { useMutation } from '@tanstack/react-query'

import { clearAuthSession } from '#/services/auth/authStorage'
import { fetchHelper } from '#/utils/fetchHelper'

type SignOutResponse = {
  success: boolean
  message: string
  data: null
}

export const useSignOut = () => {
  return useMutation({
    mutationFn: async () => {
      try {
        return await fetchHelper<SignOutResponse>(
          '/api/v1/portal/auth/do-logout',
          { method: 'POST' },
        )
      } finally {
        clearAuthSession()
      }
    },
  })
}
