import styled from '@emotion/styled'
import { Image01Icon } from 'hugeicons-react'
import type { Control } from 'react-hook-form'
import { useWatch } from 'react-hook-form'

import { TextInput } from '#/-components/ui/form/text-input'
import { Card } from '#/-components/ui/primitives/Card'
import { Typography } from '#/-components/ui/primitives/Typography'
import { theme } from '#/-components/ui/theme'

import type { ProductFormValues } from '../-utils/-product-schema'

const SectionCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 14px;
`

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${theme.colors.border};
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const ThumbnailPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 10px;
  padding: 12px;
  border-radius: 10px;
  background: ${theme.colors.paper};

  img {
    width: 72px;
    height: 72px;
    object-fit: cover;
    border: 1px solid ${theme.colors.border};
    border-radius: 8px;
  }
`

const Placeholder = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 8px;
  background: ${theme.colors.white};
  border: 1px dashed ${theme.colors.border};
  display: grid;
  place-items: center;
  color: ${theme.colors.muted};
  flex-shrink: 0;
`

interface ProductMediaProps {
  control: Control<ProductFormValues>
}

export const ProductMedia = ({ control }: ProductMediaProps) => {
  const images = useWatch({ control, name: 'images' })
  const primaryImage = images?.[0] || ''

  return (
    <SectionCard>
      <SectionHeader>
        <Typography
          variant="title"
          style={{ fontSize: '1.1rem', fontWeight: 700 }}
        >
          Media & Gambar
        </Typography>
        <Typography variant="caption" color="secondary">
          Tampilkan foto untuk kartu katalog dan halaman produk di toko online.
        </Typography>
      </SectionHeader>

      <FormGroup>
        <TextInput
          control={control}
          name="images.0"
          label="URL Gambar Utama"
          placeholder="https://images.unsplash.com/photo-..."
        />

        {primaryImage ? (
          <ThumbnailPreview>
            <img src={primaryImage} alt="Pratinjau produk" />
            <div>
              <Typography
                variant="body"
                style={{ fontWeight: 600, fontSize: '0.9rem' }}
              >
                Pratinjau Gambar
              </Typography>
              <Typography variant="caption" color="secondary">
                Gambar ini akan muncul di toko online, halaman checkout, dan
                daftar inventaris.
              </Typography>
            </div>
          </ThumbnailPreview>
        ) : (
          <ThumbnailPreview>
            <Placeholder>
              <Image01Icon size={26} />
            </Placeholder>
            <div>
              <Typography
                variant="body"
                style={{ fontWeight: 600, fontSize: '0.9rem' }}
              >
                Belum ada gambar yang dilampirkan
              </Typography>
              <Typography variant="caption" color="secondary">
                Tempel tautan gambar di atas, atau biarkan kosong untuk menggunakan
                gambar default yang telah disediakan.
              </Typography>
            </div>
          </ThumbnailPreview>
        )}
      </FormGroup>
    </SectionCard>
  )
}
