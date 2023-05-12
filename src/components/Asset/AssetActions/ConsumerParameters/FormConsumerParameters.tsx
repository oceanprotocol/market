import { FormConsumerParameter } from '@components/Publish/_types'
import React, { ReactElement } from 'react'
import styles from './FormConsumerParameters.module.css'
import Label from '@components/@shared/FormInput/Label'
import { getConsumerParameterStringOptions } from '@components/@shared/FormInput/InputElement/ConsumerParameters'
import { Field, useField } from 'formik'
import Input from '@components/@shared/FormInput'

export default function FormConsumerParameters({
  name,
  parameters
}: {
  name: string
  parameters: FormConsumerParameter[]
}): ReactElement {
  const [field] = useField<FormConsumerParameter[]>(name)

  const getParameterOptions = (parameter: FormConsumerParameter): string[] => {
    if (!parameter.options && parameter.type !== 'boolean') return []

    const updatedOptions =
      parameter.type === 'boolean'
        ? ['true', 'false']
        : parameter.type === 'select'
        ? getConsumerParameterStringOptions(
            parameter?.options as {
              [key: string]: string
            }[]
          )
        : (parameter.options as unknown as string[])

    if (!parameter.required) updatedOptions.unshift('')

    return updatedOptions
  }

  return (
    <div className={styles.container}>
      <Label htmlFor="Input the consumer parameters">
        Input the consumer parameters
      </Label>
      <div className={styles.parametersContainer}>
        {parameters?.map((param, index) => {
          const { default: defaultValue, ...fields } = param

          return (
            <div key={param.name} className={styles.parameter}>
              <Field
                {...fields}
                component={Input}
                name={`${name}[${index}].value`}
                options={getParameterOptions(param)}
                size="small"
                type={param.type === 'boolean' ? 'select' : param.type}
                value={field.value[index].value}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
