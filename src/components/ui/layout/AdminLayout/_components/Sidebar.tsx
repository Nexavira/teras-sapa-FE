import styled from '@emotion/styled'
import {
  ChartHistogramIcon,
  Discount01Icon,
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

import { NavItem } from './NavItem'
import { SectionWrapper } from './SectionWrapper'

const SidebarContainer = styled.aside`
  width: 248px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 18px 12px;
  flex-shrink: 0;
  overflow-y: auto;
  background-color: ${theme.colors.white};

  @media (max-width: 900px) {
    width: 76px;

    [data-nav-label],
    [data-section-heading],
    [data-plan-copy] {
      display: none;
    }
  }

  @media (max-width: 640px) {
    display: none;
  }
`

const SidebarNavGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`

const SidebarBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const PlanBanner = styled.div`
  background: linear-gradient(
    145deg,
    rgba(0, 168, 107, 0.24),
    rgba(0, 168, 107, 0.08)
  );
  border: 1px solid rgba(0, 168, 107, 0.4);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: ${theme.colors.white};

  button {
    border-color: ${theme.colors.primary.DEFAULT};
    border-radius: 999px;
    background: ${theme.colors.primary.DEFAULT};
  }
`

const PlanTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const NAV_ITEMS = [
  {
    to: '/admin',
    label: 'Home',
    icon: <Store01Icon size={16} />,
    activeOptions: { exact: true },
  },
  { to: '/admin/orders', label: 'Orders', icon: <Invoice01Icon size={16} /> },
  {
    to: '/admin/products',
    label: 'Products',
    icon: <ShoppingBag01Icon size={16} />,
  },
  {
    to: '/admin/customers',
    label: 'Customers',
    icon: <UserGroupIcon size={16} />,
  },
  {
    to: '/admin/analytics',
    label: 'Analytics',
    icon: <ChartHistogramIcon size={16} />,
  },
  {
    to: '/admin/discounts',
    label: 'Discounts',
    icon: <Discount01Icon size={16} />,
  },
  {
    to: '/admin/preferences',
    label: 'Preferences',
    icon: <Discount01Icon size={16} />,
  },

  {
    label: 'SALES CHANNELS',
    isSection: true,
    children: [
      {
        label: 'Online Store',
        icon: <PaintBoardIcon size={16} />,
        children: [
          { label: 'Themes', to: '/editor' },
          { label: 'Pages', to: '/admin/pages' },
          { label: 'Preferences', to: '/admin/preferences' },
        ],
        defaultOpen: true,
      },
    ],
  },
]

export interface SidebarProps {
  className?: string
}

export const Sidebar = ({ className }: SidebarProps) => {
  return (
    <SidebarContainer className={className}>
      <SidebarNavGroup>
        {NAV_ITEMS.map((item) => {
          if (item.isSection) {
            return (
              <SectionWrapper key={item.label} label={item.label}>
                {item.children.map((child) => (
                  <NavItem
                    key={child.label}
                    icon={child.icon}
                    items={child.children}
                    defaultOpen={child.defaultOpen}
                  >
                    {child.label}
                  </NavItem>
                ))}
              </SectionWrapper>
            )
          }

          return (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              activeOptions={item.activeOptions}
            >
              {item.label}
            </NavItem>
          )
        })}
      </SidebarNavGroup>

      <SidebarBottom>
        <NavItem to="/admin/settings" icon={<Settings02Icon size={16} />}>
          Settings
        </NavItem>

        <PlanBanner data-plan-copy>
          <PlanTitleRow>
            <SparklesIcon size={14} color={theme.colors.primary.DEFAULT} />
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
