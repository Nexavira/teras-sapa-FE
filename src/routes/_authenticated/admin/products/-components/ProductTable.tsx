import { ShoppingBag01Icon } from 'hugeicons-react'

import { EmptyState } from '#/-components/ui/primitives/EmptyState'
import {
  Table,
  TableCard,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '#/-components/ui/primitives/Table'
import { Typography } from '#/-components/ui/primitives/Typography'
import type { Product } from '#/types/product.type'

import { ProductTableRow } from './ProductTableRow'

interface ProductTableProps {
  products: Product[]
  isLoading: boolean
  onDelete: (product: Product) => void
}

export const ProductTable = ({
  products,
  isLoading,
  onDelete,
}: ProductTableProps) => {
  return (
    <TableCard>
      <Table>
        <Thead>
          <Tr>
            <Th>Product</Th>
            <Th>Category</Th>
            <Th>Status</Th>
            <Th>Inventory</Th>
            <Th>Price</Th>
            <Th style={{ textAlign: 'right' }}>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading ? (
            <Tr>
              <Td colSpan={6} style={{ textAlign: 'center', padding: 36 }}>
                <Typography variant="body" color="muted">
                  Loading catalog items...
                </Typography>
              </Td>
            </Tr>
          ) : products.length === 0 ? (
            <Tr>
              <Td colSpan={6}>
                <EmptyState
                  icon={<ShoppingBag01Icon size={44} />}
                  title="No products found"
                  description="Try adjusting your search query or status filter to find what you're looking for."
                />
              </Td>
            </Tr>
          ) : (
            products.map((product) => (
              <ProductTableRow
                key={product.uuid}
                product={product}
                onDelete={onDelete}
              />
            ))
          )}
        </Tbody>
      </Table>
    </TableCard>
  )
}
