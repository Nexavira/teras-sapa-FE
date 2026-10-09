import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { FileInput, TextInput } from '#/-components/ui'
import { Button } from '#/-components/ui/primitives/Button'
import { QUERY_KEYS } from '#/constant'
import { useUploadPaymentProof } from '#/services/tenant/useUploadPaymentProof'
import type { CurrentTenantPayment } from '#/types/tenant.type'

import {
  BankDetails,
  Description,
  ErrorMessage,
  Form,
  PaymentSummary,
} from '../-components/onboarding-styles'
import type { PaymentProofFormValues } from '../-utils/payment-proof-schema'
import {
  initialPaymentProofFormValues,
  paymentProofSchema,
} from '../-utils/payment-proof-schema'

export const PaymentProofForm = ({
  payment,
  onRefresh,
}: {
  payment?: CurrentTenantPayment | null
  onRefresh: () => void
}) => {
  const queryClient = useQueryClient()
  const upload = useUploadPaymentProof()
  const [formError, setFormError] = useState('')
  const [submitted, setSubmitted] = useState(
    payment?.payment.status === 'pending_verification',
  )
  const paymentForm = useForm<PaymentProofFormValues>({
    defaultValues: {
      ...initialPaymentProofFormValues,
      amount_paid: payment?.payment.amount_due
        ? String(payment.payment.amount_due)
        : '',
    },
    resolver: zodResolver(paymentProofSchema),
  })
  const instructions = payment?.transfer_instructions
  const hasTransferInstructions = Boolean(
    instructions?.available &&
    instructions.bank_name &&
    instructions.account_number &&
    instructions.account_holder,
  )
  const amountDue = payment
    ? [instructions?.currency, payment.payment.amount_due]
        .filter(Boolean)
        .join(' ')
    : null

  return (
    <Form
      onSubmit={paymentForm.handleSubmit(async (values) => {
        if (upload.isPending) return
        setFormError('')
        try {
          await upload.mutateAsync({
            amount_paid: values.amount_paid,
            proof_of_payment: values.proof_of_payment,
          })
          setSubmitted(true)
          void queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.AUTH_USER_SESSION],
          })
          onRefresh()
        } catch (error) {
          setFormError(
            error instanceof Error
              ? error.message
              : 'Gagal mengunggah. Silakan coba lagi.',
          )
        }
      })}
    >
      {formError && <ErrorMessage role="alert">{formError}</ErrorMessage>}
      {Object.entries(paymentForm.formState.errors).map(([field, error]) => (
        <ErrorMessage key={field} role="alert">
          {error.message}
        </ErrorMessage>
      ))}
      {submitted ? (
        <>
          <Description role="status">
            Bukti pembayaran telah diterima. Toko Anda akan aktif setelah disetujui.
          </Description>
          <Button type="button" onClick={() => onRefresh()}>
            Perbarui status langganan
          </Button>
        </>
      ) : (
        <>
          <Description>
            {hasTransferInstructions
              ? 'Transfer nominal di bawah ini ke rekening bank, lalu unggah bukti transfer Anda untuk verifikasi.'
              : 'Unggah bukti pembayaran Anda untuk verifikasi.'}
          </Description>
          {amountDue && (
            <PaymentSummary aria-label="Ringkasan pembayaran">
              <div>
                <span>Total tagihan</span>
                <strong>{amountDue}</strong>
              </div>
              {payment?.payment.due_date && (
                <div>
                  <span>Batas waktu</span>
                  <strong>{payment.payment.due_date.slice(0, 10)}</strong>
                </div>
              )}
            </PaymentSummary>
          )}
          {payment?.payment.rejection_reason && (
            <ErrorMessage role="alert">
              {payment.payment.rejection_reason}
            </ErrorMessage>
          )}
          {hasTransferInstructions && (
            <BankDetails aria-label="Rekening bank tujuan">
              <div>
                <dt>Bank</dt>
                <dd>{instructions?.bank_name}</dd>
              </div>
              <div>
                <dt>Nomor rekening</dt>
                <dd>{instructions?.account_number}</dd>
              </div>
              <div>
                <dt>Nama pemilik rekening</dt>
                <dd>{instructions?.account_holder}</dd>
              </div>
              {instructions?.reference && (
                <div>
                  <dt>Referensi transfer</dt>
                  <dd>{instructions.reference}</dd>
                </div>
              )}
            </BankDetails>
          )}
          <TextInput
            control={paymentForm.control}
            name="amount_paid"
            label="Jumlah yang dibayar"
            type="number"
            min="0"
            step="0.01"
            disabled={upload.isPending}
          />
          <FileInput
            control={paymentForm.control}
            name="proof_of_payment"
            label="Bukti pembayaran"
            accept="image/jpeg,image/png,application/pdf"
            maxSize={50 * 1024 * 1024}
            disabled={upload.isPending}
            helperText="JPG, PNG, atau PDF, hingga 50 MB. Unggah bukti pembayaran setelah melakukan transfer."
          />
          <Button type="submit" isLoading={upload.isPending}>
            Kirim bukti pembayaran
          </Button>
        </>
      )}
    </Form>
  )
}
