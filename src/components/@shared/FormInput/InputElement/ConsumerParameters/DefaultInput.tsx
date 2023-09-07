import React, { ReactElement } from 'react'
import Input, { InputProps } from '../..'
import { Field, useField } from 'formik'
import { FormConsumerParameter } from '@components/Publish/_types'

export default function DefaultInput({
  index,
  inputName,
  ...props
}: InputProps & {
  index: number
  inputName: string
}): ReactElement {
  const [field] = useField<FormConsumerParameter[]>(inputName)
  const fieldType = field.value[index]?.type
  const fieldOptions = field.value[index]?.options

  const getStringOptions = (
    options: { key: string; value: string }[]
  ): string[] => {
    if (!options?.length) return []

    return options.map((option) => option.key)
  }

  return (
    <Field
      {...props}
      component={Input}
      type={fieldType === 'boolean' ? 'select' : fieldType}
      options={
        fieldType === 'boolean'
          ? ['true', 'false']
          : fieldType === 'select'
          ? getStringOptions(fieldOptions)
          : fieldOptions
      }
    />
  )
}
