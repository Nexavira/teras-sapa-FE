import { useMutation } from '@tanstack/react-query'

import type { ApiResponse } from '#/types/global.type'
import { fetchHelper } from '#/utils/fetchHelper'

export interface UploadPaymentProofParams {
  amount_paid: string | number
  proof_of_payment: File
}

export const useUploadPaymentProof = () =>
  useMutation({
    mutationFn: async (params: UploadPaymentProofParams) => {
      const body = new FormData()
      body.set('_method', 'PATCH')
      body.set('amount_paid', String(params.amount_paid))
      body.set('proof_of_payment', params.proof_of_payment)
      return fetchHelper<ApiResponse<unknown>>(
        '/api/v1/portal/transaction/upload-payment-proof/',
        { method: 'POST', body },
      )
    },
  })
