import styled from '@emotion/styled'
import { ArrowRight01Icon } from 'hugeicons-react'

import { Card, ImageContainer, TextReveal, Typography } from '#/components/ui'

import {
  Container,
  EmeraldButton,
  landingColors,
  SectionHeading,
} from './shared'

const Section = styled.section`
  padding-block: clamp(112px, 13vw, 180px);
  background: ${landingColors.paper};
`

const Header = styled(Container)`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 56px;
  margin-bottom: clamp(64px, 8vw, 96px);

  > div:first-of-type {
    max-width: 900px;
  }

  @media (max-width: 760px) {
    align-items: start;
    flex-direction: column;
    gap: 32px;
  }
`

const Grid = styled(Container)`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 64px 28px;

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`

const TemplateCard = styled(Card)`
  overflow: visible;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
`

const TemplateMedia = styled(ImageContainer)`
  position: relative;
  margin-bottom: 24px;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 12px;
  background: #e5e7eb;
  box-shadow: 0 16px 40px rgba(17, 17, 17, 0.12);

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  ${TemplateCard}:hover & > img {
    transform: scale(1.055);
  }
`

const PreviewOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  background: rgba(0, 0, 0, 0.42);
  opacity: 0;
  backdrop-filter: blur(5px);
  transition: opacity 350ms ease;
  place-items: center;

  span {
    padding: 11px 22px;
    border: 1px solid ${landingColors.white};
    border-radius: 999px;
    color: ${landingColors.white};
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  ${TemplateCard}:hover & {
    opacity: 1;
  }
`

const TemplateMeta = styled.div`
  h3 {
    margin: 0;
    color: ${landingColors.ink};
    font-size: 1.5rem;
    letter-spacing: -0.04em;
    text-transform: uppercase;
  }

  p {
    margin: 6px 0 0;
    color: #7b7f87;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }
`

const Actions = styled.div`
  flex: 0 0 auto;
`

const TEMPLATES = [
  {
    name: 'Vogue Minimal',
    category: 'Apparel & Fashion',
    image:
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop',
    alt: 'Template toko fashion Vogue Minimal',
  },
  {
    name: 'Studio Arch',
    category: 'Interior & Desain',
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    alt: 'Template studio interior Studio Arch',
  },
  {
    name: 'Roasters',
    category: 'F&B dan Kopi',
    image:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop',
    alt: 'Template kedai kopi Roasters',
  },
]

export const TemplatesSection = () => {
  return (
    <Section id="templates">
      <Header>
        <div>
          <SectionHeading as="h2" color="inherit">
            <TextReveal separator="character">
              Katalog desain premium.
            </TextReveal>
          </SectionHeading>
        </div>
        <Actions data-reveal>
          <EmeraldButton render={<a href="/register" />}>
            Lihat semua template <ArrowRight01Icon size={17} />
          </EmeraldButton>
        </Actions>
      </Header>

      <Grid>
        {TEMPLATES.map((template, index) => (
          <TemplateCard
            key={template.name}
            padding="none"
            data-reveal
            data-hover-target
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            <TemplateMedia src={template.image} alt={template.alt}>
              <PreviewOverlay aria-hidden="true">
                <span>Pratinjau</span>
              </PreviewOverlay>
            </TemplateMedia>
            <TemplateMeta>
              <Typography as="h3" variant="title" weight="bold">
                {template.name}
              </Typography>
              <Typography as="p" variant="caption" color="secondary">
                {template.category}
              </Typography>
            </TemplateMeta>
          </TemplateCard>
        ))}
      </Grid>
    </Section>
  )
}
