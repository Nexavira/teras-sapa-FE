import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { getValueByPath } from '#/lib/utils'

export interface RenderProps<
  T extends FieldValues = FieldValues,
> extends ControllerRenderProps<T, Path<T>> {
  error: boolean
  helperText: string | undefined
}

interface Props<T extends FieldValues> {
  name: Path<T>
  control?: Control<T>
  render: (props: RenderProps<T>) => React.ReactElement
}

const ControlWrapper = <T extends FieldValues>({
  name,
  control,
  render,
}: Props<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, formState: { errors } }) =>
      render({
        ...field,
        error: !!getValueByPath(errors, name),
        helperText:
          (getValueByPath(errors, name)?.message as string) || undefined,
      })
    }
  />
)

export default ControlWrapper
