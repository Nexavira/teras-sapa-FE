import type { TemplateData } from '../types/theme'
import about from './about.json'
import collection from './collection.json'
import contact from './contact.json'
import faq from './faq.json'
import home from './index.json'
import shipping from './shipping.json'

export const templateCatalog: Record<
  string,
  { label: string; data: TemplateData }
> = {
  index: { label: 'Home page', data: home },
  collection: { label: 'Collection', data: collection },
  about: { label: 'About', data: about },
  contact: { label: 'Contact', data: contact },
  faq: { label: 'FAQ', data: faq },
  shipping: { label: 'Shipping & Returns', data: shipping },
}

export function getTemplate(id = 'index'): TemplateData {
  const entry = Object.hasOwn(templateCatalog, id)
    ? templateCatalog[id]
    : templateCatalog.index
  return structuredClone(entry.data)
}
