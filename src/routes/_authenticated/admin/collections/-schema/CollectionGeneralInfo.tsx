import styled from '@emotion/styled'
import { Image01Icon } from 'hugeicons-react'
import type { Control } from 'react-hook-form'
import { useWatch } from 'react-hook-form'

import { TextInput } from '#/-components/ui/form/text-input'
import { TextareaInput } from '#/-components/ui/form/textarea-input'
import { Card } from '#/-components/ui/primitives/Card'
import { Typography } from '#/-components/ui/primitives/Typography'
import { theme } from '#/-components/ui/theme'

import type { CollectionFormValues } from '../-utils/-collection-schema'

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

const FieldGrid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(
    ${({ columns = 2 }) => columns},
    minmax(0, 1fr)
  );
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
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
    width: 90px;
    height: 56px;
    object-fit: cover;
    border: 1px solid ${theme.colors.border};
    border-radius: 8px;
  }
`

const Placeholder = styled.div`
  width: 90px;
  height: 56px;
  border-radius: 8px;
  background: ${theme.colors.white};
  border: 1px dashed ${theme.colors.border};
  display: grid;
  place-items: center;
  color: ${theme.colors.muted};
  flex-shrink: 0;
`

interface CollectionGeneralInfoProps {
  control: Control<CollectionFormValues>
}

export const CollectionGeneralInfo = ({
  control,
}: CollectionGeneralInfoProps) => {
  const image = useWatch({ control, name: 'image' })

  return (
    <SectionCard>
      <SectionHeader>
        <Typography
          variant="title"
          style={{ fontSize: '1.1rem', fontWeight: 700 }}
        >
          Detail Koleksi
        </Typography>
        <Typography variant="caption" color="secondary">
          Konfigurasikan judul publik, slug URL, ringkasan, dan gambar sampul.
        </Typography>
      </SectionHeader>

      <FieldGrid columns={2}>
        <TextInput
          control={control}
          name="title"
          label="Judul Koleksi"
          placeholder="Contoh: Koleksi Musim Panas"
        />
        <TextInput
          control={control}
          name="slug"
          label="Slug URL"
          placeholder="contoh: koleksi-musim-panas"
        />
      </FieldGrid>

      <TextareaInput
        control={control}
        name="description"
        label="Deskripsi"
        placeholder="Jelaskan kurasi produk ini untuk pelanggan..."
        rows={3}
      />

      <FormGroup>
        <TextInput
          control={control}
          name="image"
          label="URL Banner / Gambar Sampul Koleksi"
          placeholder="https://images.unsplash.com/..."
        />

        {image ? (
          <ThumbnailPreview>
            <img src={image} alt="Sampul Koleksi" />
            <div>
              <Typography
                variant="body"
                style={{ fontWeight: 600, fontSize: '0.9rem' }}
              >
                Pratinjau Sampul
              </Typography>
              <Typography variant="caption" color="secondary">
                Gambar ini akan muncul di grid koleksi, kartu, dan banner tema
                toko.
              </Typography>
            </div>
          </ThumbnailPreview>
        ) : (
          <ThumbnailPreview>
            <Placeholder>
              <Image01Icon size={24} />
            </Placeholder>
            <div>
              <Typography
                variant="body"
                style={{ fontWeight: 600, fontSize: '0.9rem' }}
              >
                Banner sampul (opsional)
              </Typography>
              <Typography variant="caption" color="secondary">
                Tempel URL gambar di atas untuk menampilkan foto khusus pada
                koleksi ini.
              </Typography>
            </div>
          </ThumbnailPreview>
        )}
      </FormGroup>
    </SectionCard>
  )
}
