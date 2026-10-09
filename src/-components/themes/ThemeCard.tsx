import { Link } from '@tanstack/react-router'

import styled from '@emotion/styled'
import { ArrowUpRight01Icon, PaintBoardIcon } from 'hugeicons-react'

import { Badge, Button, Card, Typography } from '#/-components/ui'
import { theme as adminTheme } from '#/-components/ui/theme'

import type { ThemeDefinition } from '#themes'

const ThemeCardRoot = styled(Card)`
  display: flex;
  min-width: 0;
  flex-direction: column;
`

const PreviewViewport = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-bottom: 1px solid ${adminTheme.colors.border};
  background: ${adminTheme.colors.gray[100]};

  iframe {
    width: 200%;
    height: 200%;
    border: 0;
    pointer-events: none;
    transform: scale(0.5);
    transform-origin: top left;
  }
`

const PreviewLabel = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
`

const CardBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 18px;
  padding: 20px;
`

const ThemeHeading = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`

const ThemeCopy = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;

  a {
    text-decoration: none;
  }

  @media (max-width: 520px) {
    align-items: stretch;
    flex-direction: column;

    a,
    button {
      width: 100%;
    }
  }
`

export interface ThemeCardProps {
  theme: ThemeDefinition
  recommended?: boolean
}

export const ThemeCard = ({ theme, recommended = false }: ThemeCardProps) => {
  const previewUrl = `/preview?theme=${encodeURIComponent(theme.id)}`

  return (
    <ThemeCardRoot padding="none" variant="outlined">
      <PreviewViewport>
        <iframe
          aria-hidden="true"
          loading="lazy"
          src={previewUrl}
          tabIndex={-1}
          title={`Pratinjau tema ${theme.name}`}
        />
        {recommended && (
          <PreviewLabel>
            <Badge size="sm" variant="success">
              Direkomendasikan
            </Badge>
          </PreviewLabel>
        )}
      </PreviewViewport>

      <CardBody>
        <ThemeHeading>
          <ThemeCopy>
            <Typography as="h2" variant="title" weight="bold">
              {theme.name}
            </Typography>
            <Typography color="secondary" variant="body">
              {theme.description}
            </Typography>
          </ThemeCopy>
          <Badge variant="neutral">{theme.category}</Badge>
        </ThemeHeading>

        <Actions>
          <Link search={{ theme: theme.id }} to="/editor">
            <Button
              color="primary"
              startIcon={<PaintBoardIcon size={16} />}
              variant="solid"
            >
              Sesuaikan
            </Button>
          </Link>
          <a href={previewUrl} rel="noreferrer" target="_blank">
            <Button
              color="neutral"
              endIcon={<ArrowUpRight01Icon size={16} />}
              variant="outline"
            >
              Pratinjau
            </Button>
          </a>
        </Actions>
      </CardBody>
    </ThemeCardRoot>
  )
}
