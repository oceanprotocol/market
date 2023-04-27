import { ErrorMessage, Field, useField, useFormikContext } from 'formik'
import React, { ReactElement, useEffect } from 'react'
import Select from 'react-select'
import Input, { InputProps } from '../..'
import {
  AlgorithmConsumerParameter,
  FormPublishData
} from '../../../../Publish/_types'
import Button from '../../../atoms/Button'
import Tabs from '../../../atoms/Tabs'
import styles from './index.module.css'
import InputOptions from './InputOptions'
import Label from '../../Label'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const defaultParam: AlgorithmConsumerParameter = {
  name: '',
  label: '',
  description: '',
  type: 'select',
  options: [],
  default: '',
  required: false
}

export const paramTypes: AlgorithmConsumerParameter['type'][] = [
  'number',
  'text',
  'boolean',
  'multiselect',
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
    validateField('metadata.consumerParameters')
    Object.keys(defaultParam).forEach((param) =>
      setFieldTouched(`metadata.consumerParameters[${index}].${param}`, true)
    )

    if (errors?.metadata?.consumerParameters) return

    helpers.setValue([...field.value, { ...defaultParam }])
  }

  const deleteParameter = (index: number) => {
    helpers.setValue(field.value.filter((p, i) => i !== index))
  }

  const resetOptionsAndDefault = (
    parameterName: string,
    parameterType: AlgorithmConsumerParameter['type'],
    index: number
  ) => {
    if (parameterName !== 'type') return
    if (field.value[index].type === parameterType) return

    setFieldTouched(`metadata.consumerParameters[${index}].options`, false)
    setFieldTouched(`metadata.consumerParameters[${index}].default`, false)
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

  const showError = (name: string, index: number): boolean => {
    const error = errors?.metadata?.consumerParameters?.[index]?.[name]
    const isTouched = touched?.metadata?.consumerParameters?.[index]?.[name]

    return error && isTouched
  }

  const getSelectValues = (
    paramType: string,
    options: { [key: string]: string } | { [key: string]: string }[]
  ) => {
    if (!options) return null
    if (
      (paramType === 'select' && Array.isArray(options)) ||
      (paramType === 'multiselect' && !Array.isArray(options))
    )
      return null

    if (paramType === 'select') {
      const values = Object.entries(options)
      return { value: values[0][0], label: values[0][1] }
    }

    const values = (options as { [key: string]: string }[]).map((option) =>
      Object.entries(option)
    )
    return values.map((e) => ({ value: e[0][0], label: e[0][1] }))
  }

  console.log(field)

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
                    return ['select', 'multiselect'].includes(
                      field.value[index]?.type
                    ) ? (
                      <div
                        key={`${field.name}[${index}].${subField.name}`}
                        className={cx({
                          optionsContainer: true,
                          hasError: showError('options', index)
                        })}
                      >
                        <InputOptions
                          {...subField}
                          name="metadata.consumerParameters"
                          label="Options"
                          required
                          optionIndex={index}
                          defaultOptions={field.value[index]?.options}
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
                    if (
                      ['select', 'multiselect'].includes(
                        field.value[index]?.type
                      )
                    ) {
                      return (
                        <div
                          key={`${field.name}[${index}].${subField.name}`}
                          className={cx({
                            selectContainer: true,
                            hasError: showError('default', index)
                          })}
                        >
                          <Label htmlFor={subField.name}>
                            {subField?.label}
                            {subField?.required && (
                              <span
                                title="Required"
                                className={styles.required}
                              >
                                *
                              </span>
                            )}
                          </Label>
                          <Field
                            {...subField}
                            label="Options"
                            component={Select}
                            name={`${field.name}[${index}].options`}
                            key={`${field.name}[${index}].${subField.name}`}
                            components={{
                              DropdownIndicator: () => null,
                              IndicatorSeparator: () => null
                            }}
                            className={styles.select}
                            hideSelectedOptions
                            isClearable
                            isMulti={field.value[index]?.type === 'multiselect'}
                            noOptionsMessage={() => 'No options available'}
                            options={field.value[index]?.options?.map(
                              (option) => {
                                const values = Object.entries(option)
                                return {
                                  value: values[0][0],
                                  label: values[0][1]
                                }
                              }
                            )}
                            onChange={(option) => {
                              helpers.setValue(
                                field.value.map((p, i) => {
                                  if (i !== index) return p

                                  return {
                                    ...p,
                                    default: !option
                                      ? undefined
                                      : field.value[index]?.type === 'select'
                                      ? { [option.value]: option.label }
                                      : option.map((v) => ({
                                          [v.value]: v.label
                                        }))
                                  }
                                })
                              )
                            }}
                            value={getSelectValues(
                              field.value[index]?.type,
                              field.value[index]?.default as
                                | {
                                    [key: string]: string
                                  }
                                | {
                                    [key: string]: string
                                  }[]
                            )}
                            theme={(theme) => ({
                              ...theme,
                              colors: {
                                ...theme.colors,
                                primary25: 'var(--border-color)'
                              }
                            })}
                          />
                          {showError('default', index) && (
                            <div className={styles.error}>
                              <ErrorMessage
                                name={`${field.name}[${index}].default`}
                              />
                            </div>
                          )}
                        </div>
                      )
                    }

                    return (
                      <Field
                        {...subField}
                        component={Input}
                        name={`${field.name}[${index}].${subField.name}`}
                        key={`${field.name}[${index}].${subField.name}`}
                        type={
                          field.value[index].type.includes('boolean')
                            ? 'select'
                            : field.value[index].type
                        }
                        options={
                          field.value[index].type.includes('boolean')
                            ? ['true', 'false']
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
                        resetOptionsAndDefault(
                          subField.name,
                          e.target.value,
                          index
                        )
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
