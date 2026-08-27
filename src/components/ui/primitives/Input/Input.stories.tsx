import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { Input } from './index'

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'name@example.com',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    type: 'password',
    helperText: 'Must be at least 8 characters long.',
  },
}

export const WithError: Story = {
  args: {
    label: 'Username',
    defaultValue: 'invalid_user_!@#',
    error: 'Username can only contain alphanumeric characters.',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    disabled: true,
    value: 'Cannot edit this',
  },
}
