import type { TenantType } from '#/types/tenant.type'

import { OnboardingModal } from '../-components/OnboardingModal'
import { PaymentProofForm } from './PaymentProofForm'

export const SubscriptionModal = ({
  tenant,
  userUuid: _userUuid,
  onRefresh,
}: {
  tenant: TenantType
  userUuid?: string
  onRefresh: () => void
}) => {
  return (
    <OnboardingModal
      title="Selesaikan pembayaran Anda"
      description={`Unggah bukti pembayaran untuk ${tenant.name} untuk mengaktifkan toko Anda.`}
    >
      <PaymentProofForm key={tenant.uuid} onRefresh={onRefresh} />
    </OnboardingModal>
  )
}
