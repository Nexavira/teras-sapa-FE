import styled from '@emotion/styled'
import {
  ChartHistogramIcon,
  Discount01Icon,
  GridIcon,
  Invoice01Icon,
  PaintBoardIcon,
  Settings02Icon,
  ShoppingBag01Icon,
  SparklesIcon,
  Store01Icon,
  UserGroupIcon,
} from 'hugeicons-react'

import { Button } from '#/components/ui/primitives/Button'
import { Typography } from '#/components/ui/primitives/Typography'
import { theme } from '#/components/ui/theme'

import { CollapsibleNavItem } from './CollapsibleNavItem'
import { NavItem } from './NavItem'

/* Airbnb-Styled Compact Sidebar */
const SidebarContainer = styled.aside`
  width: 236px;
  background-color: ${theme.colors.background};
  border-right: 1px solid ${theme.colors.border};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px 10px;
  flex-shrink: 0;
  overflow-y: auto;
`

const SidebarNavGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`

const SectionHeadingWrapper = styled.div`
  padding: 10px 8px 4px 8px;
  margin-top: 4px;
`

const SidebarBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid ${theme.colors.border};
`

const PlanBanner = styled.div`
  background: linear-gradient(135deg, #fff0f1 0%, #ffebee 100%);
  border: 1px solid #ffd1d4;
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const PlanTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const onlineStoreSubItems = [
  { label: 'Themes', to: '/editor' },
  { label: 'Pages', to: '/admin/pages' },
  { label: 'Preferences', to: '/admin/preferences' },
]

export interface SidebarProps {
  className?: string
}

export const Sidebar = ({ className }: SidebarProps) => {
  return (
    <SidebarContainer className={className}>
      <SidebarNavGroup>
        <NavItem
          to="/admin"
          icon={<Store01Icon size={16} />}
          activeOptions={{ exact: true }}
        >
          Home
        </NavItem>

        <NavItem to="/admin/orders" icon={<Invoice01Icon size={16} />}>
          Orders
        </NavItem>

        <NavItem to="/admin/products" icon={<ShoppingBag01Icon size={16} />}>
          Products
        </NavItem>

        <NavItem to="/admin/customers" icon={<UserGroupIcon size={16} />}>
          Customers
        </NavItem>

        <NavItem to="/admin/analytics" icon={<ChartHistogramIcon size={16} />}>
          Analytics
        </NavItem>

        <NavItem to="/admin/discounts" icon={<Discount01Icon size={16} />}>
          Discounts
        </NavItem>

        <SectionHeadingWrapper>
          <Typography
            variant="caption"
            weight="bold"
            color="secondary"
            css={{
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              fontSize: '0.6875rem',
            }}
          >
            Sales channels
          </Typography>
        </SectionHeadingWrapper>

        <CollapsibleNavItem
          to="/editor"
          icon={<PaintBoardIcon size={16} />}
          label="Online Store"
          items={onlineStoreSubItems}
          defaultOpen={true}
        />

        <SectionHeadingWrapper>
          <Typography
            variant="caption"
            weight="bold"
            color="secondary"
            css={{
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              fontSize: '0.6875rem',
            }}
          >
            Apps
          </Typography>
        </SectionHeadingWrapper>

        <NavItem to="/admin/apps" icon={<GridIcon size={16} />}>
          Installed Apps
        </NavItem>
      </SidebarNavGroup>

      <SidebarBottom>
        <NavItem to="/admin/settings" icon={<Settings02Icon size={16} />}>
          Settings
        </NavItem>

        <PlanBanner>
          <PlanTitleRow>
            <SparklesIcon size={14} color={theme.colors.primary} />
            <Typography variant="caption" weight="bold">
              Subscribe for $1
            </Typography>
          </PlanTitleRow>
          <Button size="sm" variant="solid" color="primary">
            Select a plan
          </Button>
        </PlanBanner>
      </SidebarBottom>
    </SidebarContainer>
  )
}
