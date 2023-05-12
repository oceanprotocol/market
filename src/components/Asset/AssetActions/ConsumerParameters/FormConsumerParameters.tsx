import { FormConsumerParameter } from '@components/Publish/_types'
import React, { ChangeEvent, ReactElement } from 'react'
import styles from './FormConsumerParameters.module.css'
import Label from '@components/@shared/FormInput/Label'
import { getConsumerParameterStringOptions } from '@components/@shared/FormInput/InputElement/ConsumerParameters'
import { ErrorMessage, Field, useField, useFormikContext } from 'formik'
import Input from '@components/@shared/FormInput'
import { getObjectPropertyByPath } from '@utils/index'
import classNames from 'classnames/bind'
import { parseConsumerParameterDefaultValue } from '@utils/ddo'

const cx = classNames.bind(styles)

export default function FormConsumerParameters({
  name,
  parameters
}: {
  name: string
  parameters: FormConsumerParameter[]
}): ReactElement {
  const { errors, setFieldTouched } = useFormikContext()
  const [field, meta, helpers] = useField<FormConsumerParameter[]>(name)

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    setFieldTouched(`${field.name}[${index}].default`, true)
    helpers.setValue(
      field.value.map((currentParam, i) => {
        if (i !== index) return currentParam

        return {
          ...currentParam,
          default: parseConsumerParameterDefaultValue(
            currentParam.type,
            e.target.value
          )
        }
      })
    )
  }

  const showError = (name: string, index: number): boolean =>
    !!getObjectPropertyByPath(errors, `${field.name}[${index}].${name}`)

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

  const getParameterValue = (
    parameter: FormConsumerParameter,
    index: number
  ) => {
    if (parameter.type === 'boolean') {
      if (parameter.default === 'true') return 'true'
      if (parameter.default === 'false') return 'false'
    }

    return field?.value?.[index]?.default
  }

  return (
    <div className={styles.container}>
      <Label htmlFor="Input the consumer parameters">
        Input the consumer parameters
      </Label>
      <div className={styles.parametersContainer}>
        {parameters?.map((param, index) => (
          <div
            key={param.name}
            className={cx({
              parameter: true,
              hasError: showError('default', index)
            })}
          >
            <Field
              {...param}
              component={Input}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(e, index)
              }
              options={getParameterOptions(param)}
              size="small"
              type={param.type === 'boolean' ? 'select' : param.type}
              value={getParameterValue(param, index)}
            />
            {showError('default', index) && (
              <div className={styles.error}>
                <ErrorMessage name={`${field.name}[${index}].default`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
