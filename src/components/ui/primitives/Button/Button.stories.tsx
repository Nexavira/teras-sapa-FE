import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { Button } from './index'

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'ghost', 'outline'],
    },
    color: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'danger',
        'success',
        'warning',
        'info',
        'neutral',
      ],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Solid: Story = {
  args: {
    variant: 'solid',
    color: 'primary',
    children: 'Solid Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    color: 'primary',
    children: 'Ghost Button',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    color: 'primary',
    children: 'Outline Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'solid',
    color: 'secondary',
    children: 'Secondary Button',
  },
}

export const Danger: Story = {
  args: {
    variant: 'solid',
    color: 'danger',
    children: 'Danger Button',
  },
}

export const Success: Story = {
  args: {
    variant: 'solid',
    color: 'success',
    children: 'Success Button',
  },
}

export const Neutral: Story = {
  args: {
    variant: 'solid',
    color: 'neutral',
    children: 'Neutral Button',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Button',
  },
}
