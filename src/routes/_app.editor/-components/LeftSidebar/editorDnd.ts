import { KeyboardSensor, PointerSensor } from '@dnd-kit/react'

const ROOT_BLOCK_GROUP = 'root'

export const getBlockDndGroup = (sectionId: string, parentBlockId?: string) =>
  `blocks:${sectionId}:${parentBlockId || ROOT_BLOCK_GROUP}`

export const getBlockParentIdFromDndGroup = (
  group: string | number | undefined,
  sectionId: string,
): string | undefined => {
  const groupPrefix = `blocks:${sectionId}:`
  const groupId = String(group || '')

  if (!groupId.startsWith(groupPrefix)) return undefined

  const parentBlockId = groupId.slice(groupPrefix.length)
  return parentBlockId === ROOT_BLOCK_GROUP ? undefined : parentBlockId
}

const defaultTouchConstraints = (
  PointerSensor.defaults as {
    activationConstraints?: (event: unknown, source: unknown) => Array<unknown>
  }
).activationConstraints?.({ pointerType: 'touch' }, {})

const DelayConstraint = defaultTouchConstraints?.[0]
  ? (defaultTouchConstraints[0].constructor as new (options: {
      value: number
      tolerance: number
    }) => object)
  : undefined

export const editorSensors = [
  PointerSensor.configure({
    activationConstraints: () => {
      if (DelayConstraint) {
        return [new DelayConstraint({ value: 250, tolerance: 8 })]
      }
      return undefined
    },
    preventActivation: (event) => {
      const target = event.target as HTMLElement | null
      return Boolean(
        target?.closest(
          '[data-action-button], [data-no-dnd], button:not([data-nav-item]), [role="button"]:not([data-nav-item])',
        ),
      )
    },
  }),
  KeyboardSensor,
]

export const stopDndPropagation = (element: HTMLElement | null) => {
  if (!element) return
  const stop = (e: Event) => e.stopPropagation()
  element.addEventListener('pointerdown', stop)
  element.addEventListener('mousedown', stop)
  element.addEventListener('touchstart', stop)
}
