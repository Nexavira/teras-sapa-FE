import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { Autocomplete } from './index'

const meta: Meta<typeof Autocomplete> = {
  title: 'Primitives/Autocomplete',
  component: Autocomplete,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Autocomplete>

const defaultOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
  { label: 'Fig', value: 'fig' },
  { label: 'Grape', value: 'grape' },
]

export const Default: Story = {
  args: {
    placeholder: 'Select a fruit...',
    options: defaultOptions,
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Favorite Fruit',
    placeholder: 'Type to search...',
    options: defaultOptions,
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    helperText: 'Please select your country of residence.',
    options: [
      { label: 'United States', value: 'us' },
      { label: 'Canada', value: 'ca' },
      { label: 'United Kingdom', value: 'uk' },
      { label: 'Australia', value: 'au' },
    ],
  },
}

export const WithError: Story = {
  args: {
    label: 'State',
    placeholder: 'Select a state',
    error: 'Please select a valid state.',
    options: [
      { label: 'California', value: 'ca' },
      { label: 'New York', value: 'ny' },
      { label: 'Texas', value: 'tx' },
    ],
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Autocomplete',
    disabled: true,
    value: 'Cannot edit this',
    options: defaultOptions,
  },
}
