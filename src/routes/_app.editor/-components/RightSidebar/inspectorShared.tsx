import type { FC, ReactNode } from 'react'

import styled from '@emotion/styled'
import {
  ArrowLeft01Icon,
  Delete02Icon,
  InformationCircleIcon,
  Layers01Icon,
} from 'hugeicons-react'

import { DynamicSettingField } from './DynamicSettingField'
import {
  ActionIconButton,
  BackButton,
  EmptyStateContainer,
  HeaderSubtitle,
  HeaderTitle,
  HeaderTitleGroup,
  InspectorBody,
  InspectorHeader,
} from './inspectorStyles'
import type { SettingDefinition } from '#themes'

const RemoveButton = styled.button`
  margin-top: 12px;
  padding: 6px 12px;
  border-radius: 6px;
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fca5a5;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.15s ease;

  &:hover {
    background-color: #fecaca;
    border-color: #f87171;
  }
`

export interface MissingEntityStateProps {
  itemType: string
  itemId: string
  onRemove: () => void
}

export const MissingEntityState: FC<MissingEntityStateProps> = ({
  itemType,
  itemId,
  onRemove,
}) => (
  <EmptyStateContainer>
    <InformationCircleIcon size={32} />
    <div>
      {itemType} not found: {itemId}
    </div>
    <RemoveButton type="button" onClick={onRemove}>
      Remove from template
    </RemoveButton>
  </EmptyStateContainer>
)

export interface UnregisteredEntityViewProps {
  type: string
  entityName: string
  backTitle: string
  onBack: () => void
  onDelete: () => void
  message?: string
}

export const UnregisteredEntityView: FC<UnregisteredEntityViewProps> = ({
  type,
  entityName,
  backTitle,
  onBack,
  onDelete,
  message,
}) => (
  <>
    <InspectorHeader>
      <HeaderTitleGroup>
        <BackButton type="button" title={backTitle} onClick={onBack}>
          <ArrowLeft01Icon size={18} />
        </BackButton>
        <div>
          <HeaderTitle>{type}</HeaderTitle>
          <HeaderSubtitle>Unregistered {entityName}</HeaderSubtitle>
        </div>
      </HeaderTitleGroup>

      <ActionIconButton
        danger
        type="button"
        title={`Delete ${entityName}`}
        onClick={onDelete}
      >
        <Delete02Icon size={16} />
      </ActionIconButton>
    </InspectorHeader>
    <EmptyStateContainer>
      <InformationCircleIcon size={32} />
      <div>
        {message ||
          `${entityName} type "${type}" is not registered in the theme registry.`}
      </div>
    </EmptyStateContainer>
  </>
)

export interface SettingsFieldListProps {
  settings: Array<SettingDefinition>
  values: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
  emptyMessage: string
  emptyIcon?: ReactNode
}

export const SettingsFieldList: FC<SettingsFieldListProps> = ({
  settings,
  values,
  onChange,
  emptyMessage,
  emptyIcon,
}) => {
  return (
    <InspectorBody>
      {settings.length === 0 ? (
        <EmptyStateContainer>
          {emptyIcon || <Layers01Icon size={28} />}
          <div>{emptyMessage}</div>
        </EmptyStateContainer>
      ) : (
        settings.map((setting, index) => (
          <DynamicSettingField
            key={setting.id || index}
            setting={setting}
            value={values[setting.id]}
            onChange={onChange}
          />
        ))
      )}
    </InspectorBody>
  )
}
