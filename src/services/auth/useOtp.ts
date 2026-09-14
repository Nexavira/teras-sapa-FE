import { useMutation } from '@tanstack/react-query'

import type {
  SendOtpParams,
  VerifyOtpParams,
} from '#/routes/register/-utils/-otp-schema'
import { fetchHelper } from '#/utils/fetchHelper'

type OtpResponse = {
  success: boolean
  message: string
  data: unknown
}

export const useSendOtp = () => {
  return useMutation({
    mutationFn: async (params: SendOtpParams) =>
      fetchHelper<OtpResponse, SendOtpParams>('/api/v1/portal/auth/send-otp', {
        method: 'POST',
        body: params,
      }),
  })
}

export const useVerifyRegistrationOtp = () => {
  return useMutation({
    mutationFn: async (params: VerifyOtpParams) =>
      fetchHelper<OtpResponse, VerifyOtpParams>(
        '/api/v1/portal/auth/verify-otp',
        {
          method: 'POST',
          body: params,
        },
      ),
  })
}
