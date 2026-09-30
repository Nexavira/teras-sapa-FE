import type { BlockSchema } from '#themes/shared/types/theme'

export const HeroMetaBlockSchema: BlockSchema = {
  type: 'hero_meta',
  name: 'Hero metadata / Eyebrow',
  settings: [
    {
      type: 'text',
      id: 'eyebrow',
      label: 'Eyebrow badge',
      default: 'Industrial / 01',
    },
    {
      type: 'text',
      id: 'meta',
      label: 'Meta label',
      default: 'EST. 2026',
    },
  ],
}
