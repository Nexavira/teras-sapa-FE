import { useQuery } from '@tanstack/react-query'

import { fetchHelper } from '#/utils/fetchHelper'

type SessionUser = {
  uuid: string
  email: string
  name: string | null
  photo: {
    uuid: string
    original_file_name: string
    url: string
  } | null
  role: {
    uuid: string | null
    name: string | null
  }
  user_information: {
    name: string | null
    phone_number: string | null
  }
  tenants: Array<{
    uuid: string
    name: string
    slug: string
    is_suspended: boolean
  }>
}

type SessionResponse = {
  success: boolean
  message: string
  data: SessionUser
}

export const useGetUserSession = () => {
  return useQuery({
    queryKey: ['userSession'],
    queryFn: async () => {
      const response = await fetchHelper<SessionResponse>(
        '/api/v1/portal/auth/user-session-information',
      )

      return { user: response.data }
    },
  })
}
