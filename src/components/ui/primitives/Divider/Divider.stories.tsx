import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { Divider } from './index'

const meta: Meta<typeof Divider> = {
  title: 'Primitives/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Divider>

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '100%',
          height: '100px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div>Content Above</div>
        <Story />
        <div>Content Below</div>
      </div>
    ),
  ],
}

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '100%',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div>Content Left</div>
        <Story />
        <div>Content Right</div>
      </div>
    ),
  ],
}
