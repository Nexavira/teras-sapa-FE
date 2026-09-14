import { useMutation } from '@tanstack/react-query'

import type { UploadPaymentProofBody } from '#/routes/_authenticated/admin/-utils/payment-proof-schema'
import type { ApiResponse } from '#/types/global.type'
import type { TenantPayment } from '#/types/tenant.type'
import { fetchHelper } from '#/utils/fetchHelper'

export const useUploadPaymentProof = () =>
  useMutation({
    mutationFn: async (params: UploadPaymentProofBody) => {
      const body = new FormData()
      body.set('_method', 'PATCH')
      body.set('amount_paid', params.amount_paid)
      body.set('proof_of_payment', params.proof_of_payment)
      return fetchHelper<ApiResponse<TenantPayment>>(
        `/api/v1/portal/tenant/upload-payment-proof/${encodeURIComponent(params.payment_uuid)}`,
        { method: 'POST', body },
      )
    },
  })
