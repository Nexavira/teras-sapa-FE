import React, { useCallback, useEffect, useRef } from 'react'

import styled from '@emotion/styled'

import type { PreviewToEditorMessage } from '#/lib/editor/previewBridge'
import { PREVIEW_MESSAGE_TYPES } from '#/lib/editor/previewBridge'
import {
  editorActions,
  useEditorGlobalSettings,
  useEditorSelectedItem,
  useEditorTemplate,
  useEditorViewport,
} from '#/store/editorStore'

const CanvasWrapper = styled.main<{ $viewport: 'desktop' | 'mobile' }>`
  flex: 1;
  background-color: #e5e7eb;
  overflow-y: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: ${({ $viewport }) => ($viewport === 'mobile' ? '32px 16px' : '0')};
  transition: padding 0.2s ease;
`

const PreviewFrame = styled.div<{ $viewport: 'desktop' | 'mobile' }>`
  width: ${({ $viewport }) => ($viewport === 'mobile' ? '375px' : '100%')};
  min-height: ${({ $viewport }) => ($viewport === 'mobile' ? '740px' : '100%')};
  height: ${({ $viewport }) => ($viewport === 'mobile' ? '740px' : '100%')};
  background-color: #ffffff;
  border-radius: ${({ $viewport }) => ($viewport === 'mobile' ? '28px' : '0')};
  box-shadow: ${({ $viewport }) =>
    $viewport === 'mobile' ? '0 16px 40px rgba(0, 0, 0, 0.2)' : 'none'};
  border: ${({ $viewport }) =>
    $viewport === 'mobile' ? '8px solid #1f2937' : 'none'};
  overflow: hidden;
  position: relative;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`

const PreviewIframe = styled.iframe`
  width: 100%;
  height: 100%;
  min-height: 100%;
  border: none;
  display: block;
  background-color: #ffffff;
`

export interface EditorMainRendererProps {
  previewUrl?: string
  className?: string
}

export const EditorMainRenderer: React.FC<EditorMainRendererProps> = ({
  previewUrl = '/preview?mode=editor',
  className,
}) => {
  const viewport = useEditorViewport()
  const template = useEditorTemplate()
  const globalSettings = useEditorGlobalSettings()
  const selectedItem = useEditorSelectedItem()

  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Send current state to iframe canvas
  const postToIframe = useCallback((message: any) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, '*')
    }
  }, [])

  // Sync state whenever template or globalSettings change
  useEffect(() => {
    postToIframe({
      type: PREVIEW_MESSAGE_TYPES.SYNC_STATE,
      payload: {
        template,
        globalSettings,
      },
    })
  }, [template, globalSettings, postToIframe])

  // Sync selection whenever active item changes in the editor
  useEffect(() => {
    postToIframe({
      type: PREVIEW_MESSAGE_TYPES.SELECT_ITEM,
      payload: selectedItem,
    })
  }, [selectedItem, postToIframe])

  // Handle incoming messages from the preview iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent<PreviewToEditorMessage>) => {
      const data = event.data

      switch (data.type) {
        case PREVIEW_MESSAGE_TYPES.IFRAME_READY: {
          // Immediately hydrate the newly mounted iframe with the latest state
          postToIframe({
            type: PREVIEW_MESSAGE_TYPES.SYNC_STATE,
            payload: {
              template,
              globalSettings,
            },
          })
          postToIframe({
            type: PREVIEW_MESSAGE_TYPES.SELECT_ITEM,
            payload: selectedItem,
          })
          break
        }

        case PREVIEW_MESSAGE_TYPES.ITEM_CLICKED: {
          // Update selected item in editor store, switching the sidebar inspector
          editorActions.selectItem(data.payload)
          break
        }

        default:
          break
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [template, globalSettings, selectedItem, postToIframe])

  return (
    <CanvasWrapper $viewport={viewport} className={className}>
      <PreviewFrame $viewport={viewport}>
        <PreviewIframe
          ref={iframeRef}
          src={previewUrl}
          title="Storefront Live Preview"
        />
      </PreviewFrame>
    </CanvasWrapper>
  )
}
