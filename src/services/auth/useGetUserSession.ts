import { useQuery } from '@tanstack/react-query'

// import { authClient } from '#/integrations/better-auth/client'

export const useGetUserSession = () => {
  return useQuery({
    queryKey: ['userSession'],
    queryFn: async () => {
      // const { data, error } = await authClient.getSession()
      const data: any = {}
      const error: any = {}

      if (error) {
        throw new Error(error.message || 'Failed to fetch session')
      }

      return data
    },
  })
}
