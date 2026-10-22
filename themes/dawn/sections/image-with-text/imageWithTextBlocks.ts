import type {
  BlockPreset,
  SectionInstance,
  TemplateData,
} from '#themes/shared/types/theme'

export function getImageWithTextPresets(
  settings: SectionInstance['settings'] = {},
): Array<BlockPreset> {
  const {
    image = '/images/dawn/hero-editorial.webp',
    eyebrow = 'Considered by design',
    heading = 'Fewer things. Better made.',
    text = 'Natural materials, enduring shapes, and thoughtful details. We make everyday pieces to keep, wear, and live with for years.',
    button_label = 'Our approach',
    button_link = '/pages/about',
  } = settings
  return [
    {
      type: 'editorial_image',
      settings: { image, alt: 'Natural everyday essentials' },
    },
    ...(eyebrow ? [{ type: 'editorial_eyebrow', settings: { eyebrow } }] : []),
    ...(heading ? [{ type: 'editorial_heading', settings: { heading } }] : []),
    ...(text ? [{ type: 'editorial_text', settings: { text } }] : []),
    ...(button_label
      ? [{ type: 'editorial_link', settings: { button_label, button_link } }]
      : []),
  ]
}

export function normalizeImageWithText(template: TemplateData): TemplateData {
  return {
    ...template,
    sections: Object.fromEntries(
      Object.entries(template.sections).map(([sectionId, section]) => {
        if (
          section.type !== 'image_with_text' ||
          section.settings.content_blocks_version === 1
        )
          return [sectionId, section]
        const blocks = { ...section.blocks }
        const order = getImageWithTextPresets(section.settings).map(
          (preset, index) => {
            let id = `${sectionId}_content_${index}`
            while (Object.hasOwn(blocks, id)) id += '_'
            blocks[id] = {
              id,
              type: preset.type,
              settings: preset.settings || {},
            }
            return id
          },
        )
        return [
          sectionId,
          {
            ...section,
            settings: { ...section.settings, content_blocks_version: 1 },
            blocks,
            block_order: [...order, ...(section.block_order || [])],
          },
        ]
      }),
    ),
  }
}
