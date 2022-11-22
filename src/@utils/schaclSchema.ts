import { retrieveShaclSchema } from '@utils/aquarius'
import { ShaclSchemaField } from '@context/MarketMetadata/_shaclType'

import { capitalizeFirstLetter } from '@utils/textTransform'

function getMinMax(valueField: string, field: ShaclSchemaField) {
  const min = field.minLength
  const max = field.maxLength

  return {
    minLength: min,
    maxLength: max
  }
}

export async function validateFieldSchaclSchema(
  path: string,
  value: string,
  createError: any
) {
  const keyField = path.split('.')[0]
  const valueField = path.split('.')[1]
  const schemaFields: any = await retrieveShaclSchema()
  const fieldSchema: ShaclSchemaField = schemaFields[keyField][valueField]
  const { minLength, maxLength } = getMinMax(valueField, fieldSchema)

  if (value.length < minLength) {
    return createError({
      message: `${capitalizeFirstLetter(
        valueField === 'name' ? 'title' : valueField
      )} must be at least ${minLength} characters`
    })
  } else if (value.length > maxLength) {
    return createError({
      message: `${capitalizeFirstLetter(
        valueField === 'name' ? 'title' : valueField
      )} must have maximum ${maxLength} characters`
    })
  } else {
    return value
  }
}
