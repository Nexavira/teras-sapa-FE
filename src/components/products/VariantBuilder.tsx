import styled from '@emotion/styled'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { Button, Typography } from '#/components/ui'
import { TextInput } from '#/components/ui/form'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
`

const VariantRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr auto;
  gap: 12px;
  align-items: center;
`

export const VariantBuilder = () => {
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  })

  return (
    <Container>
      <Typography variant="title">Variants</Typography>
      {fields.map((field, index) => (
        <VariantRow key={field.id}>
          <TextInput
            control={control}
            name={`variants.${index}.sku`}
            placeholder="SKU"
          />
          <TextInput
            control={control}
            name={`variants.${index}.name`}
            placeholder="Name (e.g. Size M)"
          />
          <TextInput
            control={control}
            name={`variants.${index}.priceOverride`}
            placeholder="Price Override"
            type="number"
            step="0.01"
          />
          <TextInput
            control={control}
            name={`variants.${index}.stockQuantity`}
            placeholder="Stock"
            type="number"
          />
          <Button type="button" color="danger" onClick={() => remove(index)}>
            Remove
          </Button>
        </VariantRow>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            sku: '',
            name: '',
            priceOverride: '',
            stockQuantity: 0,
            attributes: {},
          })
        }
        style={{ width: 'fit-content' }}
      >
        + Add Variant
      </Button>
    </Container>
  )
}
