import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '#/-components/ui/primitives/Button'
import { useUploadPaymentProof } from '#/services/tenant/useUploadPaymentProof'
import type { CurrentTenantPayment } from '#/types/tenant.type'

import {
  Description,
  ErrorMessage,
  Footnote,
  Form,
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
  payment: CurrentTenantPayment
  onRefresh: () => void
}) => {
  const queryClient = useQueryClient()
  const upload = useUploadPaymentProof()
  const [formError, setFormError] = useState('')
  const [submitted, setSubmitted] = useState(
    payment.payment.status === 'pending_verification',
  )
  const paymentForm = useForm<PaymentProofFormValues>({
    defaultValues: {
      ...initialPaymentProofFormValues,
      amount_paid: String(payment.payment.amount_due),
    },
    resolver: zodResolver(paymentProofSchema),
  })
  return (
    <Form
      onSubmit={paymentForm.handleSubmit(async (values) => {
        if (upload.isPending) return
        setFormError('')
        try {
          await upload.mutateAsync({
            payment_uuid: payment.payment.uuid,
            amount_paid: values.amount_paid,
            proof_of_payment: values.proof_of_payment,
          })
          setSubmitted(true)
          void queryClient.invalidateQueries({
            queryKey: ['current-payment'],
          })
        } catch (error) {
          setFormError(
            error instanceof Error
              ? error.message
              : 'Upload failed. Please try again.',
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
            Payment proof received. Your subscription will be activated after
            approval.
          </Description>
          <Button type="button" onClick={() => onRefresh()}>
            Refresh subscription status
          </Button>
        </>
      ) : (
        <>
          <Description>
            Amount due:{' '}
            <strong>
              {payment.transfer_instructions?.currency}{' '}
              {payment.payment.amount_due}
            </strong>
          </Description>
          {payment.payment.due_date && (
            <Description>
              Due: {payment.payment.due_date.slice(0, 10)}
            </Description>
          )}
          {payment.payment.rejection_reason && (
            <ErrorMessage role="alert">
              {payment.payment.rejection_reason}
            </ErrorMessage>
          )}
          {payment.transfer_instructions?.available ? (
            <Description>
              Bank: <strong>{payment.transfer_instructions.bank_name}</strong>
              <br />
              Account:{' '}
              <strong>{payment.transfer_instructions.account_number}</strong>
              <br />
              Account holder: {payment.transfer_instructions.account_holder}
              <br />
              Transfer reference: {payment.transfer_instructions.reference}
            </Description>
          ) : (
            <Description>
              Transfer instructions are unavailable. Please contact support for
              payment details.
            </Description>
          )}
          <label>
            Amount paid
            <input
              aria-label="Amount paid"
              type="number"
              min="0"
              step="0.01"
              required
              {...paymentForm.register('amount_paid')}
              disabled={upload.isPending}
            />
          </label>
          <label>
            Payment proof
            <input
              aria-label="Payment proof"
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              required
              disabled={upload.isPending}
              onChange={(event) =>
                paymentForm.setValue(
                  'proof_of_payment',
                  event.target.files?.[0] as File,
                  { shouldValidate: true },
                )
              }
            />
          </label>
          <Footnote>
            JPG, PNG, or PDF, up to 50 MB. Upload the receipt after making your
            transfer.
          </Footnote>
          <Button type="submit" isLoading={upload.isPending}>
            Submit payment proof
          </Button>
        </>
      )}
    </Form>
  )
}
