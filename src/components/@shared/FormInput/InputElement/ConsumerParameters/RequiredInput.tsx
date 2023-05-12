import React, { ReactElement } from 'react'
import { Field, useField } from 'formik'
import { FormConsumerParameter } from '@components/Publish/_types'
import Input, { InputProps } from '../..'

export default function RequiredInput({
  index,
  inputName,
  ...props
}: InputProps & {
  index: number
  inputName: string
}): ReactElement {
  const [field] = useField<FormConsumerParameter[]>(inputName)

  const getFieldValue = (
    fieldName: string,
    parameter: FormConsumerParameter
  ) => {
    // split the input name to every "." and keep the last
    // word which corresponds to the field name
    const valueKey = fieldName.split('.').slice(-1)[0]
    const value = parameter[valueKey]

    // convert the boolean values assigned to the "required" field
    // into the select component options ["required", "optional"]
    if (valueKey !== 'required' || typeof value === 'string') return value

    return value ? 'required' : 'optional'
  }

  return (
    <Field
      {...props}
      component={Input}
      value={getFieldValue(props.name, field.value[index])}
    />
  )
}
