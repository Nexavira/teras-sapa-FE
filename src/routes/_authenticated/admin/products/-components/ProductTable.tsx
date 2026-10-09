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
            <Th>Produk</Th>
            <Th>Kategori</Th>
            <Th>Status</Th>
            <Th>Inventaris</Th>
            <Th>Harga</Th>
            <Th style={{ textAlign: 'right' }}>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading ? (
            <Tr>
              <Td colSpan={6} style={{ textAlign: 'center', padding: 36 }}>
                <Typography variant="body" color="muted">
                  Memuat item katalog...
                </Typography>
              </Td>
            </Tr>
          ) : products.length === 0 ? (
            <Tr>
              <Td colSpan={6}>
                <EmptyState
                  icon={<ShoppingBag01Icon size={44} />}
                  title="Tidak ada produk ditemukan"
                  description="Coba sesuaikan kata kunci pencarian atau filter status untuk menemukan apa yang Anda cari."
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
