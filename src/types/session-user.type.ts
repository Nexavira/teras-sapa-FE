import type { TenantType } from './tenant.type'

export interface SessionUserType {
  uuid: string
  email: string
  name: string | null
  photo: {
    uuid: string
    original_file_name: string
    url: string
  } | null
  role: {
    uuid: string | null
    name: string | null
  }
  user_information: {
    name: string | null
    phone_number: string | null
  }
  tenants: Array<TenantType>
}
