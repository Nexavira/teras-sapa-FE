import type { ReactNode } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ThemeProvider } from '../../ThemeProvider'
import { FileInput } from './index'

const renderFileInput = (ui: ReactNode) =>
  render(<ThemeProvider>{ui}</ThemeProvider>)

describe('FileInput Primitive', () => {
  it('renders dropzone with label, helper text, and upload prompt', () => {
    renderFileInput(
      <FileInput
        label="Payment proof"
        helperText="JPG, PNG, or PDF up to 50 MB"
        accept="image/jpeg,image/png,application/pdf"
      />,
    )

    expect(screen.getByText('Payment proof')).toBeInTheDocument()
    expect(screen.getByText(/Click to browse/i)).toBeInTheDocument()
    expect(screen.getByText(/or drag and drop/i)).toBeInTheDocument()
    expect(screen.getByText('JPG, PNG, or PDF up to 50 MB')).toBeInTheDocument()
  })

  it('selects a valid file and displays preview card with details', () => {
    const onFileSelect = vi.fn()
    renderFileInput(
      <FileInput
        label="Receipt"
        accept="image/png,image/jpeg"
        onFileSelect={onFileSelect}
      />,
    )

    const file = new File(['dummy content'], 'receipt.png', {
      type: 'image/png',
    })
    const input = screen.getByLabelText('Receipt')

    fireEvent.change(input, { target: { files: [file] } })

    expect(onFileSelect).toHaveBeenCalledWith(file)
    expect(screen.getByText('receipt.png')).toBeInTheDocument()
    expect(screen.getByText('Ready')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Remove file/i }),
    ).toBeInTheDocument()
  })

  it('clears file when remove button is clicked', () => {
    const onFileSelect = vi.fn()
    renderFileInput(
      <FileInput
        label="Receipt"
        accept="image/png"
        onFileSelect={onFileSelect}
      />,
    )

    const file = new File(['sample'], 'receipt.png', { type: 'image/png' })
    const input = screen.getByLabelText('Receipt')

    fireEvent.change(input, { target: { files: [file] } })
    expect(screen.getByText('receipt.png')).toBeInTheDocument()

    const removeBtn = screen.getByRole('button', { name: /Remove file/i })
    fireEvent.click(removeBtn)

    expect(onFileSelect).toHaveBeenCalledWith(null)
    expect(screen.queryByText('receipt.png')).not.toBeInTheDocument()
    expect(screen.getByText(/Click to browse/i)).toBeInTheDocument()
  })

  it('validates maximum file size and shows error', () => {
    const onFileSelect = vi.fn()
    renderFileInput(
      <FileInput
        label="Document"
        maxSize={1024} // 1 KB
        onFileSelect={onFileSelect}
      />,
    )

    const largeFile = new File(['a'.repeat(2048)], 'big-file.pdf', {
      type: 'application/pdf',
    })
    const input = screen.getByLabelText('Document')

    fireEvent.change(input, { target: { files: [largeFile] } })

    expect(onFileSelect).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(
      /exceeds maximum allowed size/i,
    )
  })

  it('validates file type against accept prop and shows error', () => {
    const onFileSelect = vi.fn()
    renderFileInput(
      <FileInput
        label="Proof"
        accept="image/png,image/jpeg"
        onFileSelect={onFileSelect}
      />,
    )

    const textFile = new File(['hello'], 'document.txt', {
      type: 'text/plain',
    })
    const input = screen.getByLabelText('Proof')

    fireEvent.change(input, { target: { files: [textFile] } })

    expect(onFileSelect).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(
      /file type is not supported/i,
    )
  })

  it('disables dropzone and input when disabled prop is true', () => {
    renderFileInput(<FileInput label="Disabled upload" disabled />)

    const dropzone = screen.getByRole('button', { name: 'Disabled upload' })
    expect(dropzone).toHaveAttribute('aria-disabled', 'true')

    const input = screen.getByLabelText('Disabled upload')
    expect(input).toBeDisabled()
  })
})
