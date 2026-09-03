import type { Preview } from '@storybook/tanstack-react'
import '../src/styles.css'
import MockDate from 'mockdate'
import { setupWorker } from 'msw/browser'
import { mswLoader } from 'msw-storybook-addon/csf3'
import { mswHandlers } from './msw-handlers'
import { ThemeProvider } from '../src/components/ui/ThemeProvider'

const preview: Preview = {
  loaders: [
    mswLoader(async () => {
      const worker = setupWorker()
      await worker.start({ onUnhandledRequest: 'bypass' })
      return worker
    }),
  ],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  async beforeEach() {
    MockDate.set('2024-04-01T12:00:00Z')
  },
  parameters: {
    msw: { handlers: mswHandlers },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

export default preview
