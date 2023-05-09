import { ErrorMessage, Field, useField, useFormikContext } from 'formik'
import React, { ReactElement, useEffect } from 'react'
import Input, { InputProps } from '../..'
import {
  AlgorithmConsumerParameter,
  FormPublishData
} from '../../../../Publish/_types'
import Tabs from '../../../atoms/Tabs'
import styles from './index.module.css'
import InputOptions from './InputOptions'
import classNames from 'classnames/bind'
import { getObjectPropertyByPath } from '@utils/index'
import FormActions from './FormActions'
import DefaultInput from './DefaultInput'

const cx = classNames.bind(styles)

const defaultParam: AlgorithmConsumerParameter = {
  name: '',
  label: '',
  description: '',
  type: 'text',
  options: [],
  default: '',
  required: ''
}

export const paramTypes: AlgorithmConsumerParameter['type'][] = [
  'number',
  'text',
  'boolean',
  'select'
]

export function ConsumerParameters(props: InputProps): ReactElement {
  const { errors, setFieldTouched, touched } =
    useFormikContext<FormPublishData>()

  const [field, meta, helpers] = useField<AlgorithmConsumerParameter[]>(
    props.name
  )

  useEffect(() => {
    if (field.value.length === 0) helpers.setValue([{ ...defaultParam }])
  }, [])

  const resetDefaultValue = (
    parameterName: string,
    parameterType: AlgorithmConsumerParameter['type'],
    index: number
  ) => {
    if (parameterName !== 'type') return
    if (field.value[index].type === parameterType) return

    setFieldTouched(`${field.name}[${index}].default`, false)
    helpers.setValue(
      field.value.map((p, i) => {
        if (i !== index) return p

        return {
          ...defaultParam,
          ...p,
          default: defaultParam.default
        }
      })
    )
  }

  const showError = (name: string, index: number): boolean =>
    [errors, touched].every(
      (object) =>
        !!getObjectPropertyByPath(object, `${field.name}[${index}].${name}`)
    )

  return (
    <div className={styles.container}>
      <Tabs
        items={field.value.map((param, index) => {
          return {
            title: param?.name || 'New parameter',
            content: (
              <div>
                {props.fields?.map((subField: InputProps) => {
                  if (subField.name === 'options') {
                    return field.value[index]?.type === 'select' ? (
                      <div
                        key={`${field.name}[${index}].${subField.name}`}
                        className={cx({
                          optionsContainer: true,
                          hasError: showError('options', index)
                        })}
                      >
                        <InputOptions
                          {...subField}
                          name={field.name}
                          label="Options"
                          required
                          optionIndex={index}
                          defaultOptions={
                            field.value[index]?.options as {
                              [key: string]: string
                            }[]
                          }
                        />
                        {showError('options', index) && (
                          <div className={styles.error}>
                            <ErrorMessage
                              name={`${field.name}[${index}].options`}
                            />
                          </div>
                        )}
                      </div>
                    ) : null
                  }

                  if (subField.name === 'default') {
                    return (
                      <DefaultInput
                        key={`${field.name}[${index}].${props.name}`}
                        {...subField}
                        index={index}
                        fieldName={props.name}
                      />
                    )
                  }

                  return (
                    <Field
                      {...subField}
                      component={Input}
                      name={`${field.name}[${index}].${subField.name}`}
                      key={`${field.name}[${index}].${subField.name}`}
                      onChange={(e) => {
                        resetDefaultValue(subField.name, e.target.value, index)
                        field.onChange(e)
                      }}
                    />
                  )
                })}
                <FormActions fieldName={props.name} index={index} />
              </div>
            )
          }
        })}
      />
    </div>
  )
}
