import { createFileRoute, Link } from '@tanstack/react-router'

import styled from '@emotion/styled'
import {
  ArrowRight01Icon,
  EyeIcon,
  PaintBoardIcon,
  Settings02Icon,
  ShoppingBag01Icon,
  Store01Icon,
} from 'hugeicons-react'

import { Badge, Button } from '#/components/ui'
import { adminTheme } from '#/components/ui/layout/AdminLayout/adminTheme'
import { useGetUserSession } from '#/services/auth/useGetUserSession'

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(32px, 4vw, 52px);
  width: min(1180px, 100%);
  margin: 0 auto;
`

const Eyebrow = styled.span`
  color: ${adminTheme.emerald};
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
`

const Hero = styled.section`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 32px;
  min-height: 300px;
  padding: clamp(28px, 5vw, 56px);
  overflow: hidden;
  border-radius: 24px;
  background: ${adminTheme.black};
  color: ${adminTheme.white};

  &::after {
    position: absolute;
    right: -120px;
    bottom: -180px;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    background: ${adminTheme.emerald};
    filter: blur(80px);
    opacity: 0.32;
    content: '';
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 720px;
`

const HeroTitle = styled.h1`
  max-width: 720px;
  margin: 14px 0 18px;
  color: ${adminTheme.white};
  font-size: clamp(2.35rem, 5vw, 4.75rem);
  font-weight: 800;
  line-height: 0.94;
  letter-spacing: -0.05em;
  text-transform: uppercase;

  span {
    color: ${adminTheme.emerald};
  }
`

const HeroCopy = styled.p`
  max-width: 620px;
  margin: 0;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.98rem;
  line-height: 1.7;
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;

  a {
    text-decoration: none;
  }
`

const PrimaryButton = styled(Button)`
  && {
    min-height: 44px;
    padding-inline: 20px;
    border-color: ${adminTheme.emerald};
    border-radius: 999px;
    background: ${adminTheme.emerald};
    color: ${adminTheme.white};
    font-weight: 700;

    &:hover:not(:disabled) {
      border-color: ${adminTheme.emeraldDark};
      background: ${adminTheme.emeraldDark};
      opacity: 1;
    }
  }
`

const SecondaryButton = styled(Button)`
  && {
    min-height: 44px;
    padding-inline: 20px;
    border-color: rgba(255, 255, 255, 0.28);
    border-radius: 999px;
    color: ${adminTheme.white};

    &:hover:not(:disabled) {
      border-color: rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.08);
    }
  }
`

const HeroMark = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  width: 88px;
  height: 88px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.07);
  color: ${adminTheme.emerald};

  @media (max-width: 700px) {
    display: none;
  }
`

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
`

const SectionTitle = styled.h2`
  margin: 6px 0 0;
  color: ${adminTheme.ink};
  font-size: clamp(1.6rem, 3vw, 2.5rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  text-transform: uppercase;
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`

const ActionCard = styled.article`
  display: flex;
  min-height: 270px;
  flex-direction: column;
  padding: 24px;
  border: 1px solid ${adminTheme.border};
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.86);
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;

  &:hover {
    border-color: rgba(0, 168, 107, 0.5);
    box-shadow: 0 18px 50px rgba(5, 5, 5, 0.08);
    transform: translateY(-4px);
  }
`

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

const IconBox = styled.div`
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 12px;
  background: ${adminTheme.ink};
  color: ${adminTheme.emerald};
`

const CardTitle = styled.h3`
  margin: 24px 0 10px;
  color: ${adminTheme.ink};
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.025em;
`

const CardCopy = styled.p`
  margin: 0;
  color: ${adminTheme.muted};
  font-size: 0.86rem;
  line-height: 1.65;
`

const CardLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 22px;
  border-top: 1px solid ${adminTheme.border};
  color: ${adminTheme.ink};
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;

  &:hover {
    color: ${adminTheme.emeraldDark};
  }
`

const StatusBar = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 22px 24px;
  border: 1px solid ${adminTheme.border};
  border-radius: 16px;
  background: ${adminTheme.white};

  @media (max-width: 680px) {
    align-items: stretch;
    flex-direction: column;
  }
`

const StatusInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  h3 {
    margin: 0 0 4px;
    font-size: 0.95rem;
  }
  p {
    margin: 0;
    color: ${adminTheme.muted};
    font-size: 0.78rem;
    line-height: 1.5;
  }
`

const ViewStore = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 18px;
  border: 1px solid ${adminTheme.ink};
  border-radius: 999px;
  color: ${adminTheme.ink};
  font-size: 0.75rem;
  font-weight: 800;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 180ms ease;

  &:hover {
    background: ${adminTheme.ink};
    color: ${adminTheme.white};
  }
`

const quickActions = [
  {
    title: 'Products & Inventory',
    copy: 'Manage items, pricing, stock, and product variants from one focused workspace.',
    label: 'Catalog',
    linkLabel: 'Manage products',
    to: '/admin/products',
    icon: ShoppingBag01Icon,
  },
  {
    title: 'Storefront Builder',
    copy: 'Customize sections, themes, and interactive blocks with a live visual editor.',
    label: 'Visual editor',
    linkLabel: 'Open builder',
    to: '/editor',
    icon: PaintBoardIcon,
  },
  {
    title: 'Store Settings',
    copy: 'Configure payments, shipping zones, store policies, and your connected domain.',
    label: 'Configuration',
    linkLabel: 'Open settings',
    to: '/admin/settings',
    icon: Settings02Icon,
  },
] as const

export const AdminIndexPage = () => {
  const { data: session } = useGetUserSession()
  const userName = session?.user.name ?? 'there'

  return (
    <Page>
      <Hero>
        <HeroContent>
          <Eyebrow>Store command center</Eyebrow>
          <HeroTitle>
            Good day, <span>{userName}.</span>
          </HeroTitle>
          <HeroCopy>
            Your storefront is online and ready. Manage the catalog, shape your
            visual identity, and keep every store setting within reach.
          </HeroCopy>
          <Actions>
            <a href="/admin/products">
              <PrimaryButton size="sm">
                <ShoppingBag01Icon size={16} /> Add products
              </PrimaryButton>
            </a>
            <Link to="/editor">
              <SecondaryButton size="sm" variant="outline">
                <PaintBoardIcon size={16} /> Open builder
              </SecondaryButton>
            </Link>
          </Actions>
        </HeroContent>
        <HeroMark aria-hidden="true">
          <Store01Icon size={40} />
        </HeroMark>
      </Hero>

      <section>
        <SectionHeader>
          <div>
            <Eyebrow>Essentials</Eyebrow>
            <SectionTitle>Quick navigation</SectionTitle>
          </div>
          <Badge
            size="sm"
            style={{
              borderColor: 'rgba(0,168,107,.25)',
              background: adminTheme.emeraldSoft,
              color: adminTheme.emeraldDark,
            }}
          >
            Core modules
          </Badge>
        </SectionHeader>

        <CardGrid>
          {quickActions.map((item) => {
            const Icon = item.icon
            return (
              <ActionCard key={item.title}>
                <CardTop>
                  <IconBox>
                    <Icon size={23} />
                  </IconBox>
                  <Badge
                    size="sm"
                    style={{
                      borderColor: adminTheme.border,
                      background: adminTheme.paper,
                      color: adminTheme.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '.06em',
                    }}
                  >
                    {item.label}
                  </Badge>
                </CardTop>
                <CardTitle>{item.title}</CardTitle>
                <CardCopy>{item.copy}</CardCopy>
                <CardLink to={item.to}>
                  {item.linkLabel} <ArrowRight01Icon size={16} />
                </CardLink>
              </ActionCard>
            )
          })}
        </CardGrid>
      </section>

      <StatusBar>
        <StatusInfo>
          <Badge
            variant="success"
            size="md"
            dot
            style={{
              borderColor: 'rgba(0,168,107,.25)',
              background: adminTheme.emeraldSoft,
              color: adminTheme.emeraldDark,
            }}
          >
            Live
          </Badge>
          <div>
            <h3>Storefront is currently online</h3>
            <p>Customers can browse your products and place orders.</p>
          </div>
        </StatusInfo>
        <ViewStore href="/" target="_blank" rel="noopener noreferrer">
          <EyeIcon size={15} /> View live store
        </ViewStore>
      </StatusBar>
    </Page>
  )
}

export const Route = createFileRoute('/_authenticated/admin/')({
  component: AdminIndexPage,
})
