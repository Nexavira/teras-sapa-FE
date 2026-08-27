import type { Preview } from '@storybook/tanstack-react'
import '../src/styles.css'
import MockDate from 'mockdate'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { mswHandlers } from './msw-handlers'
import { ThemeProvider } from '../src/components/ui/ThemeProvider'

initialize({ onUnhandledRequest: 'bypass' })

const preview: Preview = {
  loaders: [mswLoader],
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
