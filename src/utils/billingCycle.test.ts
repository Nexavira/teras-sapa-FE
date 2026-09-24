import { describe, expect, it } from 'vitest'

import {
  isMonthly,
  isYearly,
  matchesBillingCycle,
} from './billingCycle'

describe('billingCycle utilities', () => {
  describe('isMonthly', () => {
    it('identifies monthly cycles correctly', () => {
      expect(isMonthly('monthly')).toBe(true)
      expect(isMonthly('MONTHLY')).toBe(true)
      expect(isMonthly('month')).toBe(true)
      expect(isMonthly('bulanan')).toBe(true)
      expect(isMonthly('1 month')).toBe(true)
    })

    it('returns false for non-monthly cycles', () => {
      expect(isMonthly('yearly')).toBe(false)
      expect(isMonthly('annually')).toBe(false)
      expect(isMonthly('annual')).toBe(false)
      expect(isMonthly('tahunan')).toBe(false)
      expect(isMonthly('weekly')).toBe(false)
      expect(isMonthly('')).toBe(false)
      expect(isMonthly(null)).toBe(false)
      expect(isMonthly(undefined)).toBe(false)
    })
  })

  describe('isYearly', () => {
    it('identifies annual/yearly cycles correctly', () => {
      expect(isYearly('yearly')).toBe(true)
      expect(isYearly('annually')).toBe(true)
      expect(isYearly('annual')).toBe(true)
      expect(isYearly('YEARLY')).toBe(true)
      expect(isYearly('tahunan')).toBe(true)
      expect(isYearly('1 year')).toBe(true)
    })

    it('returns false for non-yearly cycles', () => {
      expect(isYearly('monthly')).toBe(false)
      expect(isYearly('bulanan')).toBe(false)
      expect(isYearly('weekly')).toBe(false)
      expect(isYearly('')).toBe(false)
      expect(isYearly(null)).toBe(false)
      expect(isYearly(undefined)).toBe(false)
    })
  })

  describe('matchesBillingCycle', () => {
    it('matches monthly packages', () => {
      expect(matchesBillingCycle('monthly', 'monthly')).toBe(true)
      expect(matchesBillingCycle('annually', 'monthly')).toBe(false)
    })

    it('matches yearly packages', () => {
      expect(matchesBillingCycle('yearly', 'yearly')).toBe(true)
      expect(matchesBillingCycle('annually', 'yearly')).toBe(true)
      expect(matchesBillingCycle('monthly', 'yearly')).toBe(false)
    })
  })
})
