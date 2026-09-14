import { useMutation } from '@tanstack/react-query'

import type { RegisterFormType } from '#/routes/register/-utils/-register-schema'
import { fetchHelper } from '#/utils/fetchHelper'

type RegisterResponse = {
  success: boolean
  message: string
  data: {
    email: string
  }
}

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: async (params: RegisterFormType) => {
      return fetchHelper<RegisterResponse, RegisterFormType>(
        '/api/v1/portal/auth/register',
        {
          method: 'POST',
          body: params,
        },
      )
    },
  })
}
