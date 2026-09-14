import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

import {
  Description,
  Intro,
  ModalCard,
  Overlay,
  Title,
} from './onboarding-styles'

export const OnboardingModal = ({
  title,
  description,
  children,
  wide = false,
  hideHeader = false,
  fullScreen = false,
}: {
  title: string
  description: string
  children: ReactNode
  wide?: boolean
  hideHeader?: boolean
  fullScreen?: boolean
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const previousFocus = document.activeElement
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (!dialogRef.current?.contains(document.activeElement)) {
      dialogRef.current?.querySelector<HTMLElement>('[role="dialog"]')?.focus()
    }
    return () => {
      document.body.style.overflow = originalOverflow
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [])
  return (
    <Overlay ref={dialogRef} role="presentation" $fullScreen={fullScreen}>
      <ModalCard
        tabIndex={-1}
        $wide={wide}
        $fullScreen={fullScreen}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        aria-describedby="onboarding-description"
        padding="none"
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return
          const focusable = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              'button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]',
            ),
          ).filter((element) => !element.closest('[hidden], [inert]'))
          const first = focusable.at(0)
          const last = focusable.at(-1)
          if (!first || !last) {
            event.preventDefault()
            return
          }
          if (
            event.shiftKey &&
            (document.activeElement === first ||
              !focusable.includes(document.activeElement as HTMLElement))
          ) {
            event.preventDefault()
            last.focus()
          } else if (
            !event.shiftKey &&
            (document.activeElement === last ||
              !focusable.includes(document.activeElement as HTMLElement))
          ) {
            event.preventDefault()
            first.focus()
          }
        }}
      >
        {hideHeader ? (
          <div hidden>
            <span id="onboarding-title">{title}</span>
            <span id="onboarding-description">{description}</span>
          </div>
        ) : (
          <Intro>
            <Title id="onboarding-title">{title}</Title>
            <Description id="onboarding-description">{description}</Description>
          </Intro>
        )}
        {children}
      </ModalCard>
    </Overlay>
  )
}
