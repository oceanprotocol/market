import { ErrorMessage, Field, useField, useFormikContext } from 'formik'
import React, { ReactElement, useEffect } from 'react'
import Input, { InputProps } from '../..'
import {
  AlgorithmConsumerParameter,
  FormPublishData
} from '../../../../Publish/_types'
import Button from '../../../atoms/Button'
import Tabs from '../../../atoms/Tabs'
import styles from './index.module.css'
import InputOptions from './InputOptions'
import classNames from 'classnames/bind'
import { getObjectPropertyByPath } from '@utils/index'

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
  const { errors, setFieldTouched, validateField, touched } =
    useFormikContext<FormPublishData>()

  const [field, meta, helpers] = useField<AlgorithmConsumerParameter[]>(
    props.name
  )

  useEffect(() => {
    if (field.value.length === 0) helpers.setValue([{ ...defaultParam }])
  }, [])

  const addParameter = (index: number) => {
    // validate parameter before allowing the creation of a new one
    validateField(field.name)
    Object.keys(defaultParam).forEach((param) =>
      setFieldTouched(`${field.name}[${index}].${param}`, true)
    )

    if (getObjectPropertyByPath(errors, field.name)) return

    helpers.setValue([...field.value, { ...defaultParam }])
  }

  const deleteParameter = (index: number) => {
    helpers.setValue(field.value.filter((p, i) => i !== index))
  }

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

  const getStringOptions = (options: { [key: string]: string }[]): string[] => {
    if (!options?.length) return []

    return options.map((option) => Object.keys(option)[0])
  }

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
                      <Field
                        {...subField}
                        required={field.value[index].required === 'required'}
                        component={Input}
                        name={`${field.name}[${index}].${subField.name}`}
                        key={`${field.name}[${index}].${subField.name}`}
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

                <div className={styles.actions}>
                  <Button
                    style="ghost"
                    size="small"
                    disabled={field.value.length === 1}
                    onClick={(e) => {
                      e.preventDefault()
                      deleteParameter(index)
                    }}
                  >
                    Delete parameter
                  </Button>
                  <Button
                    style="primary"
                    size="small"
                    onClick={(e) => {
                      e.preventDefault()
                      addParameter(index)
                    }}
                  >
                    Add new parameter
                  </Button>
                </div>
              </div>
            )
          }
        })}
      />
    </div>
  )
}
