export type BillingCycleType = 'monthly' | 'yearly'

export const isMonthly = (cycle?: string | null): boolean => {
  if (!cycle) return false
  const normalized = cycle.toLowerCase().trim()
  return normalized.includes('month') || normalized === 'bulanan'
}

export const isYearly = (cycle?: string | null): boolean => {
  if (!cycle) return false
  const normalized = cycle.toLowerCase().trim()
  return (
    normalized.includes('year') ||
    normalized.includes('annual') ||
    normalized === 'tahunan'
  )
}

export const matchesBillingCycle = (
  packageCycle: string | null | undefined,
  filterCycle: BillingCycleType,
): boolean => {
  if (filterCycle === 'monthly') {
    return isMonthly(packageCycle)
  }
  return isYearly(packageCycle)
}
