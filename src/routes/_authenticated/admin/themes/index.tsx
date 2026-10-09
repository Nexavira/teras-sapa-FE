import { createFileRoute } from '@tanstack/react-router'

import styled from '@emotion/styled'
import { PaintBoardIcon } from 'hugeicons-react'

import { ThemeCard } from '#/-components/themes'
import { Card, PageHeader, Typography } from '#/-components/ui'
import { theme } from '#/-components/ui/theme'

import { DEFAULT_THEME_ID, themeRegistry } from '#themes'

const Page = styled.div`
  display: flex;
  width: min(1200px, 100%);
  margin: 0 auto;
  flex-direction: column;
  gap: 28px;
`

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const InfoCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 14px;
  color: ${theme.colors.text.secondary};

  svg {
    flex: 0 0 auto;
    color: ${theme.colors.primary.DEFAULT};
  }
`

export const ThemesPage = () => {
  const themes = Object.values(themeRegistry)

  return (
    <Page>
      <PageHeader
        description="Pilih fondasi etalase toko, lalu sesuaikan halaman, seksi, dan pengaturan globalnya di editor."
        title="Tema"
      />

      <InfoCard padding="md" variant="flat">
        <PaintBoardIcon size={22} />
        <Typography color="inherit" variant="body">
          Setiap tema menyertakan pratinjau langsung. Editor memuat halaman,
          seksi, dan pengaturan untuk tema yang Anda buka.
        </Typography>
      </InfoCard>

      <ThemeGrid>
        {themes.map((item) => (
          <ThemeCard
            key={item.id}
            recommended={item.id === DEFAULT_THEME_ID}
            theme={item}
          />
        ))}
      </ThemeGrid>
    </Page>
  )
}

export const Route = createFileRoute('/_authenticated/admin/themes/')({
  head: () => ({
    meta: [{ title: 'Tema | Teras Sapa' }],
  }),
  component: ThemesPage,
})
