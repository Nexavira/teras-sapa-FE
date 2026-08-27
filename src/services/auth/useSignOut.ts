import { useMutation } from '@tanstack/react-query'

// import { authClient } from '#/integrations/better-auth/client'

export const useSignOut = () => {
  return useMutation({
    mutationFn: async () => {
      // const { data, error } = await authClient.signOut()
      const data: any = {}
      const error: any = {}

      if (error) {
        throw new Error(error.message || 'Failed to sign out')
      }

      return data
    },
  })
}
