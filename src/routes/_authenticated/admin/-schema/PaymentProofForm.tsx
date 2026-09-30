import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '#/-components/ui/primitives/Button'
import { useUploadPaymentProof } from '#/services/tenant/useUploadPaymentProof'
import type { CurrentTenantPayment } from '#/types/tenant.type'

import {
  BankDetails,
  Description,
  ErrorMessage,
  Footnote,
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
  const instructions = payment.transfer_instructions
  const hasTransferInstructions = Boolean(
    instructions?.available &&
    instructions.bank_name &&
    instructions.account_number &&
    instructions.account_holder,
  )
  const amountDue = [instructions?.currency, payment.payment.amount_due]
    .filter(Boolean)
    .join(' ')
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
            Transfer the amount below to the bank account, then upload your
            receipt for verification.
          </Description>
          <PaymentSummary aria-label="Payment summary">
            <div>
              <span>Amount due</span>
              <strong>{amountDue}</strong>
            </div>
            {payment.payment.due_date && (
              <div>
                <span>Due date</span>
                <strong>{payment.payment.due_date.slice(0, 10)}</strong>
              </div>
            )}
          </PaymentSummary>
          {payment.payment.rejection_reason && (
            <ErrorMessage role="alert">
              {payment.payment.rejection_reason}
            </ErrorMessage>
          )}
          {hasTransferInstructions ? (
            <BankDetails aria-label="Payment bank account">
              <div>
                <dt>Bank</dt>
                <dd>{instructions?.bank_name}</dd>
              </div>
              <div>
                <dt>Account number</dt>
                <dd>{instructions?.account_number}</dd>
              </div>
              <div>
                <dt>Account holder</dt>
                <dd>{instructions?.account_holder}</dd>
              </div>
              {instructions?.reference && (
                <div>
                  <dt>Transfer reference</dt>
                  <dd>{instructions.reference}</dd>
                </div>
              )}
            </BankDetails>
          ) : (
            <ErrorMessage role="alert">
              Transfer instructions are unavailable. Please contact support for
              payment details.
            </ErrorMessage>
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
