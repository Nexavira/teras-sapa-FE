import type { RefObject } from 'react'
import { useLayoutEffect, useRef } from 'react'

import gsap from 'gsap'

// Match the landing page's word reveals, stagger, and soft spring entrances.
export function useOnboardingAnimations(
  rootRef: RefObject<HTMLElement | null>,
  step: number,
  isOpen: boolean,
  choicesKey: string,
  selectionKey: string,
) {
  const previousStep = useRef(step)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !isOpen) return
    const direction = step >= previousStep.current ? 1 : -1
    previousStep.current = step
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: 'power4.out' } })
        timeline
          .fromTo(
            '[data-chapter-eyebrow]',
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
          )
          .fromTo(
            '[data-chapter-word]',
            { yPercent: 110 * direction, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.035 },
            0.08,
          )
          .fromTo(
            '[data-chapter-fade]',
            { y: 28 * direction, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.85, stagger: 0.1 },
            0.22,
          )
          .fromTo(
            '[aria-current="step"] b',
            { scale: 0.75 },
            { scale: 1, duration: 0.65, ease: 'back.out(1.7)' },
            0.15,
          )
      }, root)
      return () => context.revert()
    })
    return () => media.revert()
  }, [rootRef, step, isOpen])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !isOpen) return
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        const choices = root.querySelectorAll('[data-onboarding-choice]')
        if (!choices.length) return
        gsap.fromTo(
          choices,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.065,
            ease: 'power4.out',
          },
        )
      }, root)
      return () => context.revert()
    })
    return () => media.revert()
  }, [rootRef, step, isOpen, choicesKey])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !isOpen || !selectionKey) return
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        const selected = root.querySelectorAll(
          '[data-onboarding-choice][aria-pressed="true"]',
        )
        if (selected.length) {
          gsap.fromTo(
            selected,
            { scale: 0.97 },
            { scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
          )
        }
      }, root)
      return () => context.revert()
    })
    return () => media.revert()
  }, [rootRef, isOpen, selectionKey])
}
