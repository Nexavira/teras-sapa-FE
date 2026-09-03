import type { RefObject } from 'react'
import { useEffect } from 'react'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

export function useLandingAnimations(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: !prefersReducedMotion,
      syncTouch: false,
      anchors: prefersReducedMotion ? false : true,
    })

    const updateScrollTrigger = () => ScrollTrigger.update()
    const updateLenis = (time: number) => lenis.raf(time * 1000)

    lenis.on('scroll', updateScrollTrigger)
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    const cursor = root.querySelector<HTMLElement>('[data-cursor]')
    const hoverTargets = Array.from(
      root.querySelectorAll<HTMLElement>('a, button, [data-hover-target]'),
    )

    const handlePointerMove = (event: PointerEvent) => {
      if (!cursor) return
      gsap.to(cursor, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.12,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const handlePointerEnter = () => {
      if (cursor) gsap.to(cursor, { scale: 4, duration: 0.25 })
    }
    const handlePointerLeave = () => {
      if (cursor) gsap.to(cursor, { scale: 1, duration: 0.25 })
    }

    window.addEventListener('pointermove', handlePointerMove)
    hoverTargets.forEach((target) => {
      target.addEventListener('pointerenter', handlePointerEnter)
      target.addEventListener('pointerleave', handlePointerLeave)
    })

    const context = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('[data-reveal], [data-reveal-item]', {
          autoAlpha: 1,
          y: 0,
        })
        return
      }

      const heroTimeline = gsap.timeline({ defaults: { ease: 'power4.out' } })
      gsap.utils
        .toArray<HTMLElement>('[data-text-reveal][data-reveal-on="load"]')
        .forEach((element, index) => {
          const separator = element.dataset.revealSeparator
          const items = element.querySelectorAll('[data-reveal-item]')

          heroTimeline.fromTo(
            items,
            { yPercent: 115, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: separator === 'character' ? 1.1 : 0.8,
              stagger: separator === 'character' ? 0.025 : 0.035,
            },
            index * 0.2,
          )
        })

      heroTimeline.fromTo(
        '[data-hero-fade]',
        { y: 28, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12 },
        0.72,
      )

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 56, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 84%', once: true },
          },
        )
      })

      gsap.utils
        .toArray<HTMLElement>('[data-text-reveal][data-reveal-on="scroll"]')
        .forEach((element) => {
          const separator = element.dataset.revealSeparator
          const items = element.querySelectorAll('[data-reveal-item]')

          gsap.fromTo(
            items,
            { yPercent: 100, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: separator === 'character' ? 0.9 : 0.72,
              stagger: separator === 'character' ? 0.018 : 0.032,
              ease: 'power4.out',
              scrollTrigger: { trigger: element, start: 'top 88%', once: true },
            },
          )
        })

      gsap.fromTo(
        '[data-app-preview]',
        { scale: 0.86, y: 90, autoAlpha: 0 },
        {
          scale: 1,
          y: 0,
          autoAlpha: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '[data-app-preview-section]',
            start: 'top 88%',
            end: 'top 25%',
            scrub: 1,
          },
        },
      )

      gsap.to('[data-marquee-track]', {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-marquee]',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.utils
        .toArray<HTMLImageElement>('[data-parallax] > img')
        .forEach((image) => {
          gsap.fromTo(
            image,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: image.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        })

      gsap.fromTo(
        '[data-payment-pill]',
        { y: 32, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '[data-payments]',
            start: 'top 62%',
            once: true,
          },
        },
      )
    }, root)

    ScrollTrigger.refresh()

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      hoverTargets.forEach((target) => {
        target.removeEventListener('pointerenter', handlePointerEnter)
        target.removeEventListener('pointerleave', handlePointerLeave)
      })
      context.revert()
      lenis.off('scroll', updateScrollTrigger)
      lenis.destroy()
      gsap.ticker.remove(updateLenis)
      gsap.ticker.lagSmoothing(500, 33)
    }
  }, [rootRef])
}
