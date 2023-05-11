import { ConsumerParameter } from '@components/Publish/_types'
import React, { ChangeEvent, ReactElement } from 'react'
import styles from './FormConsumerParameters.module.css'
import Label from '@components/@shared/FormInput/Label'
import { getConsumerParameterStringOptions } from '@components/@shared/FormInput/InputElement/ConsumerParameters'
import { ErrorMessage, Field, useField, useFormikContext } from 'formik'
import Input from '@components/@shared/FormInput'
import { getObjectPropertyByPath } from '@utils/index'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function FormConsumerParameters({
  name,
  parameters
}: {
  name: string
  parameters: ConsumerParameter[]
}): ReactElement {
  const { errors, setFieldTouched } = useFormikContext()
  const [field, meta, helpers] = useField<ConsumerParameter[]>(name)

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    setFieldTouched(`${field.name}[${index}].default`, true)
    helpers.setValue(
      field.value.map((currentParam, i) => {
        if (i !== index) return currentParam

        return {
          ...currentParam,
          default: e.target.value
        }
      })
    )
  }

  const showError = (name: string, index: number): boolean =>
    !!getObjectPropertyByPath(errors, `${field.name}[${index}].${name}`)

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
              options={
                param.type === 'boolean'
                  ? ['true', 'false']
                  : param.type === 'select'
                  ? getConsumerParameterStringOptions(
                      param?.options as {
                        [key: string]: string
                      }[]
                    )
                  : (param.options as unknown as string[])
              }
              size="small"
              type={param.type === 'boolean' ? 'select' : param.type}
              value={
                typeof param.default === 'boolean' && param.default
                  ? 'true'
                  : typeof param.default === 'boolean' && !param.default
                  ? 'false'
                  : (field?.value?.[index]?.default as string | number)
              }
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
