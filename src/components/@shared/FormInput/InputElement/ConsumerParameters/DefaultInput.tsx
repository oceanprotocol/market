import React, { ReactElement } from 'react'
import Input, { InputProps } from '../..'
import { Field, useField } from 'formik'
import { ConsumerParameter } from '@components/Publish/_types'

export default function DefaultInput({
  index,
  inputName,
  ...props
}: InputProps & {
  index: number
  inputName: string
}): ReactElement {
  const [field] = useField<ConsumerParameter[]>(inputName)

  const getStringOptions = (options: { [key: string]: string }[]): string[] => {
    if (!options?.length) return []

    return options.map((option) => Object.keys(option)[0])
  }

  return (
    <Field
      {...props}
      component={Input}
      type={
        field.value[index].type === 'boolean'
          ? 'select'
          : field.value[index].type
      }
      options={
        field.value[index].type === 'boolean'
          ? ['true', 'false']
          : field.value[index].type === 'select'
          ? getStringOptions(
              field.value[index]?.options as {
                [key: string]: string
              }[]
            )
          : field.value[index].options
      }
    />
  )
}
