import React, { ReactElement } from 'react'
import Input, { InputProps } from '../..'
import { Field, useField, useFormikContext } from 'formik'
import {
  AlgorithmConsumerParameter,
  FormPublishData
} from '@components/Publish/_types'
import { defaultConsumerParam } from '.'

export default function ConsumerParameterInput({
  index,
  fieldName,
  ...props
}: InputProps & {
  index: number
  fieldName: string
}): ReactElement {
  const { setFieldTouched } = useFormikContext<FormPublishData>()
  const [field, meta, helpers] =
    useField<AlgorithmConsumerParameter[]>(fieldName)

  const resetDefaultValue = (
    parameterName: string,
    parameterType: AlgorithmConsumerParameter['type'],
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

  return (
    <Field
      {...props}
      component={Input}
      onChange={(e) => {
        resetDefaultValue(props.name, e.target.value, index)
        field.onChange(e)
      }}
    />
  )
}
