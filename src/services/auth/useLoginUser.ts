import { useMutation } from '@tanstack/react-query'

// import { authClient } from '#/integrations/better-auth/client'

type LoginParams = {
  email: string
  password: string
}

export const useLoginUser = () => {
  return useMutation({
    mutationFn: async (params: LoginParams) => {
      // const { data, error } = await authClient.signIn.email(params)
      const data: any = {}
      const error: any = {}

      if (error) {
        throw new Error(error.message || 'Failed to log in')
      }

      return data
    },
  })
}
