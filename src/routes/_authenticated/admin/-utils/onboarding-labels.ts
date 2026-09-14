import { humanize } from '#/utils/humanize'

const labels: Record<string, string> = {
  commerce: 'Toko online',
  ecommerce: 'Toko online',
  e_commerce: 'Toko online',
  portfolio: 'Portofolio',
  company_profile: 'Profil perusahaan',
  landing_page: 'Halaman promosi',
  basic: 'Dasar',
  monthly: 'per bulan',
  yearly: 'per tahun',
  annual: 'per tahun',
  weekly: 'per minggu',
  lifetime: 'Sekali bayar',
}

export const onboardingLabel = (value: string) =>
  labels[value] || humanize(value)
