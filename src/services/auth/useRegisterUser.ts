import { useMutation } from '@tanstack/react-query'

// import { authClient } from '#/integrations/better-auth/client'

type RegisterParams = {
  name: string
  email: string
  password: string
}

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: async (params: RegisterParams) => {
      // const { data, error } = await authClient.signUp.email(params)
      const data: any = {}
      const error: any = {}

      if (error) {
        throw new Error(error.message || 'Failed to register')
      }

      return data
    },
  })
}
