import { useMutation } from '@tanstack/react-query'

// import { authClient } from '#/integrations/better-auth/client'

export const useGoogleLogin = () => {
  return useMutation({
    mutationFn: async () => {
      // const { data, error } = await authClient.signIn.social({
      //   provider: 'google',
      // })
      const data: any = {}
      const error: any = {}

      if (error) {
        throw new Error(error.message || 'Failed to login with Google')
      }

      return data
    },
  })
}
