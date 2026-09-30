import { useState } from 'react'

import { useCreateSubscription } from '#/services/tenant/useCreateSubscription'
import { useCurrentPayment } from '#/services/tenant/useCurrentPayment'
import type { CurrentTenantPayment, TenantType } from '#/types/tenant.type'

import {
  Description,
  ErrorMessage,
  Form,
} from '../-components/onboarding-styles'
import { OnboardingModal } from '../-components/OnboardingModal'
import { PaymentProofForm } from './PaymentProofForm'
import { SubscriptionForm } from './SubscriptionForm'

export const SubscriptionModal = ({
  tenant,
  userUuid,
  onRefresh,
}: {
  tenant: TenantType
  userUuid: string
  onRefresh: () => void
}) => {
  const current = useCurrentPayment(userUuid, tenant.uuid)
  const mutation = useCreateSubscription()
  const [createdPayment, setCreatedPayment] =
    useState<CurrentTenantPayment | null>(null)
  const [error, setError] = useState('')
  const payment = current.data ?? createdPayment
  const isPaymentStep = Boolean(payment)
  const refresh = () => {
    void current.refetch()
    onRefresh()
  }
  return (
    <OnboardingModal
      wide={!current.isPending && !current.isError && !payment}
      title={
        isPaymentStep ? 'Complete your payment' : 'Activate your subscription'
      }
      description={
        isPaymentStep
          ? `Pay for ${tenant.name} by bank transfer and upload the receipt.`
          : `Choose a subscription for ${tenant.name} to continue.`
      }
    >
      {current.isPending ? (
        <Form as="div">
          <Description>Checking subscription payment…</Description>
        </Form>
      ) : current.isError ? (
        <Form as="div">
          <ErrorMessage role="alert">
            Could not load payment status.{' '}
            <button type="button" onClick={() => void current.refetch()}>
              Retry
            </button>
          </ErrorMessage>
        </Form>
      ) : payment ? (
        payment.payment.status === 'paid' ? (
          <Form as="div">
            <Description role="status">
              Payment received. Waiting for subscription activation.
            </Description>
            <button type="button" onClick={refresh}>
              Refresh subscription status
            </button>
          </Form>
        ) : (
          <PaymentProofForm
            key={`${payment.payment.uuid}:${payment.payment.status}`}
            payment={payment}
            onRefresh={refresh}
          />
        )
      ) : (
        <SubscriptionForm
          initialWebsiteType="commerce"
          isPending={mutation.isPending}
          error={error}
          onSubmit={async (values) => {
            if (mutation.isPending) return
            setError('')
            try {
              const result = await mutation.mutateAsync({
                ...values,
                tenant_uuid: tenant.uuid,
                is_trial: 0,
              })
              setCreatedPayment(result)
              refresh()
            } catch (failure) {
              setError(
                failure instanceof Error
                  ? failure.message
                  : 'Could not create the subscription. Please try again.',
              )
            }
          }}
        />
      )}
    </OnboardingModal>
  )
}
