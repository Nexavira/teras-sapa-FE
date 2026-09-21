import styled from '@emotion/styled'

import { theme } from '../../theme'
import { Card } from '../Card'

export const TableCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  border: 1px solid ${theme.colors.border};
  border-radius: 16px;
  background: ${theme.colors.white};
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`

export const Thead = styled.thead`
  background: ${theme.colors.paper};
`

export const Tbody = styled.tbody``

export const Th = styled.th`
  padding: 14px 20px;
  border-bottom: 1px solid ${theme.colors.border};
  background: ${theme.colors.paper};
  color: ${theme.colors.text.secondary};
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
`

export const Tr = styled.tr`
  border-bottom: 1px solid ${theme.colors.border};
  transition: background 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(0, 168, 107, 0.02);
  }
`

export const Td = styled.td`
  padding: 16px 20px;
  color: ${theme.colors.text.primary};
  font-size: 0.88rem;
  vertical-align: middle;
`
