export interface TenantType {
  uuid: string
  name: string
  slug: string
  is_suspended: boolean
  active_subscription?: TenantSubscription | null
}

export interface TenantCategory {
  uuid: string
  name: string
}

export interface TenantPackage {
  uuid: string
  title: string
  tier: string
  website_type: string
  description: string
  price_prefix: string
  price: string | number
  original_price: string | number | null
  price_suffix: string
  billing_cycle: string
  trial_days: number
  features: Array<{
    text: string
    is_highlighted: boolean
  }>
}

export interface TenantPayment {
  uuid: string
  amount_due: string | number
  status: string
  due_date?: string | null
  rejection_reason?: string | null
}

export interface TransferInstructions {
  available: boolean
  currency?: string
  bank_name?: string
  account_number?: string
  account_holder?: string
  reference?: string
}

export interface CurrentTenantPayment {
  payment: TenantPayment
  transfer_instructions?: TransferInstructions | null
}

export interface CreatedTenant extends CurrentTenantPayment {
  tenant: TenantType
}

export interface TenantSubscription {
  uuid: string
  status?: string
  ends_at?: string | null
}
