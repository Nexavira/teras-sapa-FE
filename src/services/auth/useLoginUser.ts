import { useMutation } from '@tanstack/react-query'

import type { AuthUser } from '#/services/auth/authStorage'
import { saveAuthSession } from '#/services/auth/authStorage'
import { fetchHelper } from '#/utils/fetchHelper'

type LoginParams = {
  email: string
  password: string
}

type LoginResponse = {
  success: boolean
  message: string
  data: {
    user: AuthUser
    token: string
  }
}

export const useLoginUser = () => {
  return useMutation({
    mutationFn: async (params: LoginParams) => {
      const response = await fetchHelper<LoginResponse, LoginParams>(
        '/api/v1/portal/auth/do-login',
        {
          method: 'POST',
          body: params,
        },
      )

      saveAuthSession(response.data.token, response.data.user)
      return response
    },
  })
}
