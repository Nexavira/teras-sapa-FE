import type { ReactNode } from 'react'

import styled from '@emotion/styled'

import { theme } from '../../theme'
import { Header, Sidebar } from './_components'
import { adminTheme } from './adminTheme'

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  color: ${adminTheme.ink};
  font-family: var(--font-sans), ${theme.typography.fontFamily};
  background-color: ${adminTheme.paper};
`

const LayoutBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`

const MainCanvas = styled.main`
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: clamp(24px, 3vw, 48px);
  background:
    radial-gradient(
      circle at 90% 0%,
      rgba(0, 168, 107, 0.09),
      transparent 28rem
    ),
    ${adminTheme.paper};

  @media (max-width: 720px) {
    padding: 24px 16px 40px;
  }
`

export interface AdminLayoutProps {
  children: ReactNode
  storeName?: string
}

export const AdminLayout = ({
  children,
  storeName = 'My Store',
}: AdminLayoutProps) => {
  return (
    <LayoutContainer>
      <Header storeName={storeName} />
      <LayoutBody>
        <Sidebar />
        <MainCanvas>{children}</MainCanvas>
      </LayoutBody>
    </LayoutContainer>
  )
}

export * from './_components'
