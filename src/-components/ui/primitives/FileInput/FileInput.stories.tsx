import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { FileInput } from './index'

const meta: Meta<typeof FileInput> = {
  title: 'Primitives/FileInput',
  component: FileInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FileInput>

export const Default: Story = {
  args: {},
}

export const WithLabel: Story = {
  args: {
    label: 'Upload Document',
  },
}

export const PaymentProof: Story = {
  args: {
    label: 'Payment proof',
    accept: 'image/jpeg,image/png,application/pdf',
    maxSize: 50 * 1024 * 1024,
    helperText:
      'JPG, PNG, or PDF, up to 50 MB. Upload the receipt after making your transfer.',
  },
}

export const WithError: Story = {
  args: {
    label: 'Payment receipt',
    accept: 'image/jpeg,image/png,application/pdf',
    error: 'The uploaded file is corrupt or exceeds the maximum size.',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    disabled: true,
    helperText: 'Upload is currently disabled while processing.',
  },
}
