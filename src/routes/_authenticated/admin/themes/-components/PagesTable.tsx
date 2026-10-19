import React from 'react'

import { Link } from '@tanstack/react-router'

import styled from '@emotion/styled'
import {
  ArrowUpRight01Icon,
  File01Icon,
  PaintBoardIcon,
  PlusSignIcon,
} from 'hugeicons-react'

import {
  Badge,
  Button,
  Card,
  theme,
  Typography,
} from '#/-components/ui'
import type { TenantTemplatePageType } from '#/types/cms.type'

const TableContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${theme.colors.border};
`

const TableElement = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th {
    padding: 12px 20px;
    background-color: ${theme.colors.gray[100]};
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${theme.colors.text.secondary};
    border-bottom: 1px solid ${theme.colors.border};
  }

  td {
    padding: 16px 20px;
    border-bottom: 1px solid ${theme.colors.border};
    font-size: 0.875rem;
    color: ${theme.colors.text.primary};
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background-color: ${theme.colors.gray[100]}80;
  }
`

const SlugTag = styled.code`
  background-color: ${theme.colors.gray[100]};
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.8125rem;
  color: ${theme.colors.text.secondary};
`

const EmptyBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 14px;
  text-align: center;
`

export interface PagesTableProps {
  pages: TenantTemplatePageType[]
  themeId: string
  tenantTemplateUuid: string
  onAddPage: () => void
}

export const PagesTable: React.FC<PagesTableProps> = ({
  pages,
  themeId,
  tenantTemplateUuid,
  onAddPage,
}) => {
  return (
    <TableContainer padding="none" variant="outlined">
      <TableHeader>
        <div>
          <Typography as="h3" variant="title" weight="bold">
            Halaman Website Dibuat ({pages.length})
          </Typography>
          <Typography variant="caption" color="secondary">
            Daftar halaman yang diinstansiasi dari template schema dan tersimpan
            di backend.
          </Typography>
        </div>
        <Button
          size="sm"
          variant="solid"
          color="primary"
          startIcon={<PlusSignIcon size={15} />}
          onClick={onAddPage}
        >
          Buat Halaman
        </Button>
      </TableHeader>

      {pages.length === 0 ? (
        <EmptyBox>
          <File01Icon size={36} color={theme.colors.text.secondary} />
          <div>
            <Typography variant="body" weight="bold">
              Belum ada halaman untuk tema ini
            </Typography>
            <Typography variant="caption" color="secondary">
              Mulai buat halaman pertama Anda dari katalog template seksi tema.
            </Typography>
          </div>
          <Button
            size="sm"
            variant="outline"
            color="primary"
            startIcon={<PlusSignIcon size={15} />}
            onClick={onAddPage}
          >
            Buat Halaman dari Template
          </Button>
        </EmptyBox>
      ) : (
        <TableElement>
          <thead>
            <tr>
              <th>Nama Halaman</th>
              <th>Alamat URL (Slug)</th>
              <th>Struktur Template</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => {
              const rawData = page.template_data as {
                order?: string[]
                sections?: Record<string, unknown>
              } | null
              const sectionCount = rawData?.order?.length || 0
              const previewUrl = `/preview?theme=${encodeURIComponent(themeId)}&template=${encodeURIComponent(page.slug)}`

              return (
                <tr key={page.uuid}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <File01Icon
                        size={16}
                        color={theme.colors.primary.DEFAULT}
                      />
                      <Typography variant="body" weight="bold">
                        {page.title}
                      </Typography>
                    </div>
                  </td>
                  <td>
                    <SlugTag>/{page.slug}</SlugTag>
                  </td>
                  <td>
                    <Typography variant="caption" color="secondary">
                      {sectionCount > 0
                        ? `${sectionCount} seksi terkonfigurasi`
                        : 'Seksi kustom'}
                    </Typography>
                  </td>
                  <td>
                    <Badge size="sm" variant={page.is_active ? 'success' : 'neutral'}>
                      {page.is_active ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '8px',
                      }}
                    >
                      <Link
                        to="/editor"
                        search={{
                          theme: themeId,
                          page: page.slug,
                          tenant_template: tenantTemplateUuid,
                        }}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          color="primary"
                          startIcon={<PaintBoardIcon size={14} />}
                        >
                          Sesuaikan
                        </Button>
                      </Link>
                      <a href={previewUrl} target="_blank" rel="noreferrer">
                        <Button
                          size="sm"
                          variant="ghost"
                          color="neutral"
                          endIcon={<ArrowUpRight01Icon size={14} />}
                        >
                          Lihat
                        </Button>
                      </a>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </TableElement>
      )}
    </TableContainer>
  )
}
