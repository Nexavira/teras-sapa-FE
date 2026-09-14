import React from 'react'
import { renderToString } from 'react-dom/server'
import { chromium } from 'playwright'
import { PageRenderer } from './src/routes/preview/-components/PageRenderer'

const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.setContent(renderToString(<PageRenderer mode="editor" />))
  const surfaces = page.locator('[data-editor-surface]')
  const count = await surfaces.count()
  if (!count) throw new Error('No editor surfaces rendered')
  for (let index = 0; index < count; index++) {
    const surface = surfaces.nth(index)
    await surface.hover({ position: { x: 4, y: 4 } })
    await page.waitForTimeout(180)
    const state = await surface.evaluate((element) => {
      const overlay = getComputedStyle(element, '::after')
      return { type: element.getAttribute('data-section-type') || element.getAttribute('data-block-type'), color: overlay.outlineColor, width: overlay.outlineWidth, zIndex: overlay.zIndex, pointerEvents: overlay.pointerEvents }
    })
    if (state.color !== 'rgb(96, 165, 250)' || state.width !== '2px' || state.zIndex !== '100' || state.pointerEvents !== 'none') throw new Error(JSON.stringify(state))
    console.log('Hover verified:', state.type)
    await surface.evaluate((element) => element.setAttribute('data-selected', 'true'))
    await page.waitForTimeout(180)
    const selectedColor = await surface.evaluate((element) => getComputedStyle(element, '::after').outlineColor)
    if (selectedColor !== 'rgb(37, 99, 235)') throw new Error('Selected outline missing')
    await surface.evaluate((element) => element.setAttribute('data-selected', 'false'))
  }
  const block = page.locator('[data-block-id][data-editor-surface]').first()
  await block.hover()
  await page.waitForTimeout(180)
  const parentColor = await block.evaluate((element) => getComputedStyle(element.parentElement!.closest('[data-editor-surface]')!, '::after').outlineColor)
  if (parentColor !== 'rgb(96, 165, 250)') throw new Error('Parent hover outline missing')
  await page.locator('[data-section-type="header"]').screenshot({ path: '/tmp/shopiti-header-hover.png' })
  const hero = page.locator('[data-section-type="hero_banner"]')
  if (await hero.count()) {
    await hero.hover({ position: { x: 4, y: 4 } })
    await page.waitForTimeout(180)
    await hero.screenshot({ path: '/tmp/shopiti-banner-hover.png' })
  }
  console.log(`Verified hover and selected overlays on all ${count} rendered surfaces, including parent hover.`)
} finally {
  await browser.close()
}
