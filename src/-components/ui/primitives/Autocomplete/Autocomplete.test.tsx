import { useState } from 'react'

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ThemeProvider } from '../../ThemeProvider'
import { Autocomplete } from './index'

const options = [{ value: 'category-uuid', label: 'Food and drink' }]

describe('Autocomplete selection', () => {
  afterEach(cleanup)

  it('displays the label while emitting the UUID for a controlled field', async () => {
    const onChange = vi.fn()
    const Field = () => {
      const [value, setValue] = useState('')
      return (
        <Autocomplete
          label="Category"
          options={options}
          value={value}
          onValueChange={(next) => {
            setValue(next)
            onChange(next)
          }}
        />
      )
    }
    render(
      <ThemeProvider>
        <Field />
      </ThemeProvider>,
    )
    const input = screen.getByRole('combobox')
    fireEvent.focus(input)
    fireEvent.click(
      await screen.findByRole('option', { name: 'Food and drink' }),
    )
    expect(input.value).toBe('Food and drink')
    expect(onChange).toHaveBeenLastCalledWith('category-uuid')
    fireEvent.change(input, { target: { value: '' } })
    expect(input.value).toBe('')
    expect(onChange).toHaveBeenLastCalledWith('')
  })

  it('displays the label for an uncontrolled default UUID', () => {
    render(
      <ThemeProvider>
        <Autocomplete options={options} defaultValue="category-uuid" />
      </ThemeProvider>,
    )
    expect(screen.getByRole('combobox').value).toBe('Food and drink')
  })
})
