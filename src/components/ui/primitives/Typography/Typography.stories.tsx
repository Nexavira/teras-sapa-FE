import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { Typography } from './index'

const meta: Meta<typeof Typography> = {
  title: 'Primitives/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Typography>

export const Display: Story = {
  args: {
    as: 'h1',
    variant: 'display',
    weight: 'bold',
    children: 'Display Typography',
  },
}

export const Title: Story = {
  args: {
    as: 'h2',
    variant: 'title',
    weight: 'medium',
    children: 'Title Typography',
  },
}

export const Body: Story = {
  args: {
    as: 'p',
    variant: 'body',
    weight: 'regular',
    children:
      'Body typography. This is the default text size for paragraphs and other text elements in the application.',
  },
}

export const Caption: Story = {
  args: {
    as: 'span',
    variant: 'caption',
    color: 'secondary',
    children: 'Caption typography, usually used for smaller helper text.',
  },
}
