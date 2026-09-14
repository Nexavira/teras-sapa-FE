import { z } from 'zod'

export const paymentProofSchema = z.object({
  amount_paid: z
    .string()
    .refine(
      (value) =>
        value.trim() !== '' &&
        Number.isFinite(Number(value)) &&
        Number(value) >= 0,
      'Enter a valid amount paid.',
    ),
  proof_of_payment: z.custom<File>(
    (value) =>
      typeof File !== 'undefined' &&
      value instanceof File &&
      ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type) &&
      value.size > 0 &&
      value.size <= 50 * 1024 * 1024,
    'Choose a JPG, PNG, or PDF file up to 50 MB.',
  ),
})

export type PaymentProofFormValues = z.infer<typeof paymentProofSchema>

export const initialPaymentProofFormValues: Partial<PaymentProofFormValues> = {
  amount_paid: '',
}

export const uploadPaymentProofSchema = paymentProofSchema.extend({
  payment_uuid: z.string().min(1),
})

export type UploadPaymentProofBody = z.infer<typeof uploadPaymentProofSchema>
