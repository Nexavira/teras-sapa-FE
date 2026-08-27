import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { FileUpload } from './index'

const meta: Meta<typeof FileUpload> = {
  title: 'Primitives/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FileUpload>

export const Default: Story = {
  args: {},
}

export const WithLabel: Story = {
  args: {
    label: 'Upload Document',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Profile Picture',
    helperText: 'Please upload a square image for best results.',
    accept: 'image/*',
  },
}

export const WithError: Story = {
  args: {
    label: 'Upload Resume',
    error: 'The uploaded file is corrupt. Please try again.',
  },
}

export const ImageOnly: Story = {
  args: {
    label: 'Upload Image',
    accept: 'image/*',
    helperText: 'Only image files are allowed',
  },
}

export const WithSizeLimit: Story = {
  args: {
    label: 'Upload Large File',
    maxSize: 5 * 1024 * 1024, // 5MB
    helperText: 'Max file size is 5MB',
  },
}
