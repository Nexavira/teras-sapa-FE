import styled from '@emotion/styled'

import { Button } from '#/-components/ui/primitives/Button'
import type { BillingCycleType } from '#/utils/billingCycle'
import { humanize } from '#/utils/humanize'

interface PackageCatalogControlsProps {
  websiteTypes: Array<string>
  websiteType: string
  billingCycle: BillingCycleType
  disabled: boolean
  onWebsiteTypeChange: (value: string) => void
  onBillingCycleChange: (cycle: BillingCycleType) => void
}

interface AnnualDetailStyleProps {
  $active: boolean
}

const ControlsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
`

const TypeChoices = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const TypeButton = styled(Button)`
  border-radius: ${({ theme }) => theme.radius.lg};

  &[aria-pressed='true'] {
    background: ${({ theme }) => theme.colors.primary.DARKER};
    color: ${({ theme }) => theme.colors.text.inverse};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary.DEFAULT};
    outline-offset: 4px;
  }
`

const BillingToggle = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border: 1px solid #dce5de;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: #f1f5f2;
`

const BillingToggleButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.85rem;
  font-weight: 600;

  &[aria-pressed='true'] {
    background: ${({ theme }) => theme.colors.primary.DARKER};
    color: ${({ theme }) => theme.colors.text.inverse};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &[aria-pressed='false'] {
    background: transparent;
    color: ${({ theme }) => theme.colors.text.secondary};

    &:hover {
      background: rgba(0, 0, 0, 0.04);
      color: ${({ theme }) => theme.colors.text.primary};
    }
  }
`

const AnnualDetail = styled.span<AnnualDetailStyleProps>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ $active }) => ($active ? '#C8FAD4' : '#E6F7F5')};
  color: ${({ $active }) => ($active ? '#004D50' : '#007864')};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
  transition:
    background-color 180ms ease,
    color 180ms ease;
`

export const PackageCatalogControls = ({
  websiteTypes,
  websiteType,
  billingCycle,
  disabled,
  onWebsiteTypeChange,
  onBillingCycleChange,
}: PackageCatalogControlsProps) => (
  <ControlsRow>
    <TypeChoices role="group" aria-label="Pilih jenis website">
      {websiteTypes.map((type) => (
        <TypeButton
          key={type}
          type="button"
          variant={websiteType === type ? 'solid' : 'outline'}
          aria-pressed={websiteType === type}
          disabled={disabled}
          onClick={() => onWebsiteTypeChange(type)}
        >
          {humanize(type)}
        </TypeButton>
      ))}
    </TypeChoices>
    {websiteType && (
      <BillingToggle role="group" aria-label="Periode langganan">
        <BillingToggleButton
          type="button"
          aria-label="Bulanan"
          variant={billingCycle === 'monthly' ? 'solid' : 'ghost'}
          aria-pressed={billingCycle === 'monthly'}
          disabled={disabled}
          onClick={() => onBillingCycleChange('monthly')}
        >
          Bulanan
        </BillingToggleButton>
        <BillingToggleButton
          type="button"
          aria-label="Tahunan"
          variant={billingCycle === 'yearly' ? 'solid' : 'ghost'}
          aria-pressed={billingCycle === 'yearly'}
          disabled={disabled}
          onClick={() => onBillingCycleChange('yearly')}
        >
          <span>Tahunan</span>
          <AnnualDetail $active={billingCycle === 'yearly'}>
            Bayar 10 bulan, bukan 12
          </AnnualDetail>
        </BillingToggleButton>
      </BillingToggle>
    )}
  </ControlsRow>
)
