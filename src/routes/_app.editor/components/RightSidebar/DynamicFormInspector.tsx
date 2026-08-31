import { Layers01Icon } from 'hugeicons-react'

import { useEditorSelectedItem } from '#/store/editorStore'

import { BlockInspector } from './BlockInspector'
import { GlobalCategoryInspector } from './GlobalCategoryInspector'
import {
  EmptyStateContainer,
  HeaderSubtitle,
  HeaderTitle,
  HeaderTitleGroup,
  InspectorBody,
  InspectorContainer,
  InspectorHeader,
} from './inspectorStyles'
import { SectionInspector } from './SectionInspector'

export interface DynamicFormInspectorProps {
  className?: string
}

export const DynamicFormInspector = ({
  className,
}: DynamicFormInspectorProps) => {
  const selectedItem = useEditorSelectedItem()

  if (!selectedItem) {
    return (
      <InspectorContainer className={className}>
        <InspectorHeader>
          <HeaderTitleGroup>
            <div>
              <HeaderTitle>Theme Inspector</HeaderTitle>
              <HeaderSubtitle>Live Editor</HeaderSubtitle>
            </div>
          </HeaderTitleGroup>
        </InspectorHeader>
        <InspectorBody>
          <EmptyStateContainer>
            <Layers01Icon size={36} color="#9ca3af" />
            <div
              style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}
            >
              No Item Selected
            </div>
            <div
              style={{ fontSize: '12px', color: '#6b7280', maxWidth: '220px' }}
            >
              Select a section or block on the canvas or left sidebar to
              customize its settings in real-time.
            </div>
          </EmptyStateContainer>
        </InspectorBody>
      </InspectorContainer>
    )
  }

  return (
    <InspectorContainer className={className}>
      {selectedItem.type === 'section' && selectedItem.id && (
        <SectionInspector sectionId={selectedItem.id} />
      )}
      {selectedItem.type === 'block' &&
        selectedItem.id &&
        selectedItem.sectionId && (
          <BlockInspector
            sectionId={selectedItem.sectionId}
            blockId={selectedItem.id}
          />
        )}
      {selectedItem.type === 'global_settings_category' &&
        selectedItem.category && (
          <GlobalCategoryInspector categoryName={selectedItem.category} />
        )}
    </InspectorContainer>
  )
}
