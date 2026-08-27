import { createFileRoute, Link } from '@tanstack/react-router'

import {
  ArrowRight01Icon,
  EyeIcon,
  PaintBoardIcon,
  Settings02Icon,
  ShoppingBag01Icon,
  Store01Icon,
} from 'hugeicons-react'

import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  theme,
  Typography,
} from '#/components/ui'
import { useGetUserSession } from '#/services/auth/useGetUserSession'

export const AdminIndexPage = () => {
  const { data: session } = useGetUserSession()
  const userName = session?.user.name

  return (
    <div
      style={{
        maxWidth: '1080px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.xl,
      }}
    >
      {/* Airbnb Hero Greeting Card */}
      <Card
        variant="default"
        padding="lg"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF9FA 100%)',
          borderRadius: '16px',
          border: `1px solid ${theme.colors.border}`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: theme.spacing.md,
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.xs,
              maxWidth: '640px',
            }}
          >
            <Typography variant="title" weight="bold" as="h1">
              Good day, {userName}! 👋
            </Typography>

            <Typography variant="body" color="secondary">
              Your online storefront is active and ready. Easily manage your
              catalog, design custom themes with the visual builder, or adjust
              your store preferences below.
            </Typography>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: theme.spacing.sm,
              }}
            >
              <Link to="/admin/products" style={{ textDecoration: 'none' }}>
                <Button size="sm" variant="solid" color="primary">
                  <ShoppingBag01Icon size={16} style={{ marginRight: '6px' }} />
                  Add Products
                </Button>
              </Link>

              <Link to="/editor" style={{ textDecoration: 'none' }}>
                <Button size="sm" variant="outline">
                  <PaintBoardIcon size={16} style={{ marginRight: '6px' }} />
                  Open Builder
                </Button>
              </Link>
            </div>
          </div>

          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '20px',
              backgroundColor: '#FFF0F1',
              color: theme.colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(255, 90, 95, 0.15)',
              flexShrink: 0,
            }}
          >
            <Store01Icon size={38} />
          </div>
        </div>
      </Card>

      {/* Quick Action Navigation Section */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.sm,
          }}
        >
          <Typography variant="body" weight="bold">
            Quick Navigation
          </Typography>
          <Badge variant="neutral" size="sm">
            Core Modules
          </Badge>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: theme.spacing.md,
          }}
        >
          {/* Card 1: Products */}
          <Card
            variant="interactive"
            padding="lg"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderRadius: '14px',
            }}
          >
            <div>
              <CardHeader>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: '#FFF0F1',
                      color: theme.colors.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ShoppingBag01Icon size={22} />
                  </div>
                  <Badge variant="primary" size="sm">
                    Catalog
                  </Badge>
                </div>
                <CardTitle
                  style={{ marginTop: theme.spacing.sm, color: '#222222' }}
                >
                  Products & Inventory
                </CardTitle>
                <CardDescription style={{ color: '#717171' }}>
                  Manage items, update prices, manage stock quantities, and
                  organize variants.
                </CardDescription>
              </CardHeader>
            </div>

            <CardFooter>
              <Link
                to="/admin/products"
                style={{ textDecoration: 'none', width: '100%' }}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  Manage Products
                  <ArrowRight01Icon size={15} />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Card 2: Visual Web Builder */}
          <Card
            variant="interactive"
            padding="lg"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderRadius: '14px',
            }}
          >
            <div>
              <CardHeader>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: '#E6F7F5',
                      color: '#008489',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PaintBoardIcon size={22} />
                  </div>
                  <Badge variant="success" size="sm">
                    Visual Editor
                  </Badge>
                </div>
                <CardTitle
                  style={{ marginTop: theme.spacing.sm, color: '#222222' }}
                >
                  Storefront Builder
                </CardTitle>
                <CardDescription style={{ color: '#717171' }}>
                  Customize sections, headers, themes, and interactive blocks in
                  real time.
                </CardDescription>
              </CardHeader>
            </div>

            <CardFooter>
              <Link
                to="/editor"
                style={{ textDecoration: 'none', width: '100%' }}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  Open Builder
                  <ArrowRight01Icon size={15} />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Card 3: Store Settings */}
          <Card
            variant="interactive"
            padding="lg"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderRadius: '14px',
            }}
          >
            <div>
              <CardHeader>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: '#F3E8FF',
                      color: '#7C3AED',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Settings02Icon size={22} />
                  </div>
                  <Badge variant="neutral" size="sm">
                    Configuration
                  </Badge>
                </div>
                <CardTitle
                  style={{ marginTop: theme.spacing.sm, color: '#222222' }}
                >
                  Store Settings
                </CardTitle>
                <CardDescription style={{ color: '#717171' }}>
                  Configure payment gateways, shipping zones, store policies,
                  and domains.
                </CardDescription>
              </CardHeader>
            </div>

            <CardFooter>
              <Link
                to="/admin/settings"
                style={{ textDecoration: 'none', width: '100%' }}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  Configure Settings
                  <ArrowRight01Icon size={15} />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Store Status Card */}
      <Card
        variant="default"
        padding="md"
        style={{
          backgroundColor: '#FFFFFF',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: theme.spacing.md,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.md,
            }}
          >
            <Badge variant="success" size="md" dot>
              Live
            </Badge>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
            >
              <Typography variant="body" weight="bold">
                Storefront is currently online
              </Typography>
              <Typography variant="caption" color="secondary">
                Customers can view your products, browse collections, and place
                orders.
              </Typography>
            </div>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Button size="sm" variant="outline">
              <EyeIcon size={15} style={{ marginRight: '6px' }} />
              View Live Store
            </Button>
          </a>
        </div>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/admin/')({
  component: AdminIndexPage,
})
