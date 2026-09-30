import React from 'react'

import styled from '@emotion/styled'

import { SectionRegistry } from '../../registry'
import { useReveal } from '../../snippets/useReveal'
import { templateCatalog } from '../../templates/catalog'
import type {
  ImageValue,
  SectionComponentProps,
  TemplateData,
} from '#themes/shared/types/theme'

export type PageKind =
  | 'home'
  | 'about'
  | 'capabilities'
  | 'industries'
  | 'projects'
  | 'sustainability'
  | 'insights'
  | 'article'
  | 'careers'
  | 'contact'

export interface CompanyPageSettings {
  page?: PageKind
  eyebrow?: string
  title?: string
  intro?: string
  image?: string | ImageValue
}

const PageRoot = styled.div`
  width: 100%;
`

export const CompanyPage: React.FC<
  SectionComponentProps<CompanyPageSettings>
> = ({ settings, isEditor = false }) => {
  const rootRef = useReveal()
  const page = settings.page || 'home'
  const pageKey = page === 'home' ? 'index' : page
  const templateEntry = templateCatalog[pageKey]
  const templateData: TemplateData = templateEntry.data

  // Render content sections from the template (excluding persistent header/footer)
  const contentSectionIds = templateData.order.filter(
    (id) => !id.startsWith('header') && !id.startsWith('footer'),
  )

  return (
    <PageRoot ref={rootRef}>
      {contentSectionIds.map((sectionId) => {
        const sectionInstance = templateData.sections[sectionId]
        if (!sectionInstance.type) return null

        const registered = SectionRegistry[sectionInstance.type]
        if (!registered) return null

        const SectionComponent = registered.Component

        // Merge section settings and blocks with overrides for hero if this is the hero section
        const isHero = sectionInstance.type === 'company_hero'
        const mergedSettings = isHero
          ? {
              ...sectionInstance.settings,
              ...(settings.image ? { image: settings.image } : {}),
            }
          : sectionInstance.settings

        let mergedBlocks = sectionInstance.blocks
        if (isHero && mergedBlocks) {
          mergedBlocks = { ...mergedBlocks }
          for (const [blockId, block] of Object.entries(mergedBlocks)) {
            if (block.type === 'heading' && settings.title) {
              mergedBlocks[blockId] = {
                ...block,
                settings: { ...block.settings, heading: settings.title },
              }
            } else if (block.type === 'text' && settings.intro) {
              mergedBlocks[blockId] = {
                ...block,
                settings: { ...block.settings, text: settings.intro },
              }
            } else if (
              (block.type === 'image' || block.type === 'hero_image') &&
              settings.image
            ) {
              mergedBlocks[blockId] = {
                ...block,
                settings: { ...block.settings, image: settings.image },
              }
            } else if (block.type === 'hero_meta' && settings.eyebrow) {
              mergedBlocks[blockId] = {
                ...block,
                settings: { ...block.settings, eyebrow: settings.eyebrow },
              }
            }
          }
        }

        return (
          <SectionComponent
            key={sectionId}
            id={sectionId}
            settings={mergedSettings}
            blocks={mergedBlocks}
            blockOrder={sectionInstance.block_order}
            isEditor={isEditor}
          />
        )
      })}
    </PageRoot>
  )
}
