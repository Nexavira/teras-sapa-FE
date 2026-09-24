import about from './about.json'
import article from './article.json'
import capabilities from './capabilities.json'
import careers from './careers.json'
import contact from './contact.json'
import home from './index.json'
import industries from './industries.json'
import insights from './insights.json'
import projects from './projects.json'
import sustainability from './sustainability.json'
import type {
  TemplateData,
  ThemeTemplateEntry,
} from '#themes/shared/types/theme'

export const templateCatalog: Record<string, ThemeTemplateEntry> = {
  index: { label: 'Home', data: home },
  about: { label: 'About us', data: about },
  capabilities: { label: 'Capabilities', data: capabilities },
  industries: { label: 'Industries', data: industries },
  projects: { label: 'Projects', data: projects },
  sustainability: { label: 'Sustainability', data: sustainability },
  insights: { label: 'Insights', data: insights },
  article: { label: 'Article', data: article },
  careers: { label: 'Careers', data: careers },
  contact: { label: 'Contact', data: contact },
}

export function getTemplate(id = 'index'): TemplateData {
  const entry = Object.hasOwn(templateCatalog, id)
    ? templateCatalog[id]
    : templateCatalog.index
  return structuredClone(entry.data)
}
