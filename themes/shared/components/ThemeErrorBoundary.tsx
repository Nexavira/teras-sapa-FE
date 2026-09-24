import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'

import { ThemeErrorCard } from './ThemeErrorCard'

export interface ThemeErrorBoundaryProps {
  kind: 'block' | 'section'
  id?: string
  type?: string
  name?: string
  sectionId?: string
  parentBlockId?: string
  isEditor?: boolean
  fallbackTitle?: string
  children?: ReactNode
  fallbackRender?: (error: Error, info: ErrorInfo) => ReactNode
}

interface ThemeErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ThemeErrorBoundary extends Component<
  ThemeErrorBoundaryProps,
  ThemeErrorBoundaryState
> {
  constructor(props: ThemeErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(
    error: Error,
  ): Partial<ThemeErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo })
    console.error(
      `[${this.props.kind.toUpperCase()} RENDER ERROR] in ${this.props.type || 'unknown'} (${this.props.id || 'unidentified'}):`,
      error,
      errorInfo,
    )
  }

  componentDidUpdate(prevProps: ThemeErrorBoundaryProps): void {
    if (
      this.state.hasError &&
      (prevProps.id !== this.props.id || prevProps.type !== this.props.type)
    ) {
      this.setState({ hasError: false, error: null, errorInfo: null })
    }
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallbackRender && this.state.errorInfo) {
        return this.props.fallbackRender(this.state.error, this.state.errorInfo)
      }

      return (
        <ThemeErrorCard
          kind={this.props.kind}
          title={
            this.props.fallbackTitle ||
            `${this.props.kind === 'block' ? 'Block' : 'Section'} Render Crash`
          }
          message={`An uncaught error occurred while rendering this ${this.props.kind}: ${this.state.error.message}`}
          id={this.props.id}
          type={this.props.type}
          name={this.props.name}
          sectionId={this.props.sectionId}
          parentBlockId={this.props.parentBlockId}
          error={this.state.error}
          componentStack={this.state.errorInfo?.componentStack}
          isEditor={this.props.isEditor}
        />
      )
    }

    return this.props.children
  }
}
