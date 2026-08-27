import type { ReactNode } from 'react'

import styled from '@emotion/styled'

import { theme } from '../../theme'
import { Header, Sidebar } from './_components'

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: ${theme.typography.fontFamily};
  background-color: ${theme.colors.muted};
`

const LayoutBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`

const MainCanvas = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  background-color: ${theme.colors.muted};
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
