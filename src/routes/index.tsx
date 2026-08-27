import { createFileRoute } from '@tanstack/react-router'

import { LandingPage } from '#/components/landing'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'TerasSapa. | Konten & Commerce Tanpa Batas' },
      {
        name: 'description',
        content:
          'Bangun toko online premium dan blog SEO-ready tanpa biaya marketplace bersama TerasSapa.',
      },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
      },
    ],
  }),
  component: LandingPage,
})
