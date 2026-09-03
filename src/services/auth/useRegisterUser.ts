import { useMutation } from '@tanstack/react-query'

import { fetchHelper } from '#/utils/fetchHelper'

type RegisterParams = {
  full_name: string
  phone_number: string
  email: string
  password: string
  password_confirmation: string
}

type RegisterResponse = {
  success: boolean
  message: string
  data: {
    email: string
  }
}

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: async (params: RegisterParams) => {
      return fetchHelper<RegisterResponse, RegisterParams>(
        '/api/v1/portal/auth/register',
        {
          method: 'POST',
          body: params,
        },
      )
    },
  })
}

type VerifyOtpParams = {
  email: string
  otp_code: string
  type: string
}

type VerifyOtpResponse = {
  success: boolean
  message: string
  data: unknown
}

export const useVerifyRegistrationOtp = () => {
  return useMutation({
    mutationFn: async (params: VerifyOtpParams) =>
      fetchHelper<VerifyOtpResponse, VerifyOtpParams>(
        '/api/v1/portal/auth/verify-otp',
        {
          method: 'POST',
          body: params,
        },
      ),
  })
}
