import type { Accept, FileRejection } from 'react-dropzone'

/**
 * Format bytes into human readable file size (e.g. 1.5 MB)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes <= 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Convert user-friendly comma-separated accept string to react-dropzone Accept object
 */
export const parseAcceptProp = (accept?: string): Accept | undefined => {
  if (!accept) return undefined

  const result: Accept = {}
  const tokens = accept.split(',').map((t) => t.trim())

  tokens.forEach((token) => {
    if (!token) return

    if (token.startsWith('.')) {
      // Extension format like .pdf, .png, .jpg
      const ext = token.toLowerCase()
      if (ext === '.pdf') {
        result['application/pdf'] = [...(result['application/pdf'] || []), ext]
      } else if (ext === '.jpg' || ext === '.jpeg') {
        result['image/jpeg'] = [...(result['image/jpeg'] || []), ext]
      } else if (ext === '.png') {
        result['image/png'] = [...(result['image/png'] || []), ext]
      } else if (ext === '.webp') {
        result['image/webp'] = [...(result['image/webp'] || []), ext]
      } else {
        result[`application/x-${ext.slice(1)}`] = [ext]
      }
    } else {
      // Standard MIME format like image/png, application/pdf, image/*
      if (!result[token]) {
        result[token] = []
      }
    }
  })

  return result
}

/**
 * Format an accept string or object into a human-readable summary label
 */
export const formatAcceptString = (accept?: string): string => {
  if (!accept) return ''
  return accept
    .split(',')
    .map((type) => {
      const clean = type.trim()
      if (clean === 'application/pdf' || clean === '.pdf') return 'PDF'
      if (
        clean === 'image/jpeg' ||
        clean === 'image/jpg' ||
        clean === '.jpg' ||
        clean === '.jpeg'
      )
        return 'JPG'
      if (clean === 'image/png' || clean === '.png') return 'PNG'
      if (clean === 'image/webp' || clean === '.webp') return 'WEBP'
      if (clean === 'image/gif' || clean === '.gif') return 'GIF'
      if (clean.startsWith('.')) return clean.slice(1).toUpperCase()
      if (clean.includes('/')) return clean.split('/')[1].toUpperCase()
      return clean.toUpperCase()
    })
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .join(', ')
}

/**
 * Extract clean, friendly error messages from react-dropzone FileRejection
 */
export const getRejectionErrorMessage = (
  rejection: FileRejection,
  maxSize?: number,
  accept?: string,
): string => {
  const error = rejection.errors[0]
  if (!error.code) return 'Upload failed. Please choose another file.'

  switch (error.code) {
    case 'file-too-large':
      return maxSize
        ? `File size (${formatFileSize(rejection.file.size)}) exceeds the maximum allowed size of ${formatFileSize(maxSize)}.`
        : 'File size exceeds the allowed limit.'
    case 'file-invalid-type': {
      const supported = formatAcceptString(accept)
      return supported
        ? `File type is not supported. Please upload ${supported}.`
        : 'File type is not supported.'
    }
    case 'too-many-files':
      return 'Only one file can be uploaded at a time.'
    default:
      return error.message || 'File could not be uploaded.'
  }
}
