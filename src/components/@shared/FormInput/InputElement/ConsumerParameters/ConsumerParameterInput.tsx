import React, { ReactElement } from 'react'
import Input, { InputProps } from '../..'
import { Field, useField, useFormikContext } from 'formik'
import {
  FormConsumerParameter,
  FormPublishData
} from '@components/Publish/_types'
import { defaultConsumerParam } from '.'

export default function ConsumerParameterInput({
  index,
  inputName,
  ...props
}: InputProps & {
  index: number
  inputName: string
}): ReactElement {
  const { setFieldTouched } = useFormikContext<FormPublishData>()
  const [field, meta, helpers] = useField<FormConsumerParameter[]>(inputName)

  const resetDefaultValue = (
    parameterName: string,
    parameterType: FormConsumerParameter['type'],
    index: number
  ) => {
    if (parameterName !== 'type') return
    if (field.value[index].type === parameterType) return

    setFieldTouched(`${field.name}[${index}].default`, false)
    helpers.setValue(
      field.value.map((currentParam, i) => {
        if (i !== index) return currentParam

        return {
          ...defaultConsumerParam,
          ...currentParam,
          default: defaultConsumerParam.default
        }
      })
    )
  }

  const getFieldValue = (
    fieldName: string,
    parameter: FormConsumerParameter
  ) => {
    const valueKey = fieldName.split('.').slice(-1)[0]
    const value = parameter[valueKey]

    if (valueKey !== 'required' || typeof value === 'string') return value

    return value ? 'required' : 'optional'
  }

  return (
    <Field
      {...props}
      component={Input}
      value={getFieldValue(props.name, field.value[index])}
      onChange={(e) => {
        resetDefaultValue(props.name, e.target.value, index)
        field.onChange(e)
      }}
    />
  )
}
