import { ConsumerParameter } from '@oceanprotocol/lib'
import * as Yup from 'yup'
import { SchemaLike } from 'yup/lib/types'

export function getUserCustomParameterValidationSchema(
  parameters: ConsumerParameter[]
): SchemaLike {
  const shape = {}

  parameters?.forEach((parameter) => {
    const schemaBase =
      parameter.type === 'number'
        ? Yup.number()
        : parameter.type === 'boolean'
        ? Yup.boolean()
        : Yup.string()

    Object.assign(shape, {
      [parameter.name]: parameter.required
        ? schemaBase.required('required')
        : schemaBase.nullable().transform((value) => value || null)
    })
  })

  const schema = Yup.object(shape)

  return schema
}
