import { Field, useField } from 'formik'
import React, { ReactElement, useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import Input, { InputProps } from '../..'
import { AlgorithmConsumerParameter } from '../../../../Publish/_types'
import Button from '../../../atoms/Button'
import Tabs from '../../../atoms/Tabs'
import creatableSelectStyles from '../TagsAutoComplete/index.module.css'

const defaultParam: AlgorithmConsumerParameter = {
  name: 'parameter',
  label: 'Label',
  type: 'text',
  default: '',
  required: false,
  description: 'Description',
  options: []
}

export const paramTypes: AlgorithmConsumerParameter['type'][] = [
  'number',
  'text',
  'boolean',
  'multiselect',
  'select'
]

export function ConsumerParameters(props: InputProps): ReactElement {
  const [showOptions, setShowOptions] = useState([])

  const [field, meta, helpers] = useField<AlgorithmConsumerParameter[]>(
    props.name
  )

  const addParameter = () => {
    helpers.setValue([...field.value, defaultParam])
    setShowOptions([...showOptions, false])
  }

  const deleteParameter = (index: number) => {
    helpers.setValue(field.value.filter((p, i) => i !== index))
    setShowOptions(showOptions.splice(index, 1))
  }

  return (
    <div>
      <Button
        style="primary"
        type="button"
        size="small"
        onClick={() => {
          addParameter()
        }}
      >
        Add parameter
      </Button>
      <Tabs
        items={field.value.map((param, index) => {
          return {
            title: param.name,
            content: (
              <div>
                {props.fields?.map((subField) => {
                  if (subField.name === 'options') {
                    return field.value[index]?.type?.includes('select') ? (
                      <Field
                        {...subField}
                        component={CreatableSelect}
                        name={`${field.name}[${index}].options`}
                        components={{
                          DropdownIndicator: () => null,
                          IndicatorSeparator: () => null
                        }}
                        className={creatableSelectStyles.select}
                        hideSelectedOptions
                        isMulti
                        isClearable={false}
                        noOptionsMessage={() =>
                          'Start typing to create options for the user to select.'
                        }
                        defaultValue={field.value[index]?.options?.map((o) => ({
                          value: o,
                          label: o
                        }))}
                        onChange={(value) =>
                          helpers.setValue([
                            ...field.value.map((p, i) => {
                              if (i !== index) return p

                              return {
                                ...p,
                                options: value.map((v) => v.value)
                              }
                            })
                          ])
                        }
                        theme={(theme) => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary25: 'var(--border-color)'
                          }
                        })}
                      />
                    ) : (
                      <></>
                    )
                  }

                  if (subField.name === 'default') {
                    return (
                      <Field
                        {...subField}
                        component={Input}
                        name={`${field.name}[${index}].${subField.name}`}
                        key={`${field.name}[${index}].${subField.name}`}
                        type={
                          field.value[index].type.includes('select')
                            ? 'select'
                            : field.value[index].type
                        }
                        multiple={field.value[index].type === 'multiselect'}
                        options={field.value[index].options}
                      />
                    )
                  }

                  return (
                    <Field
                      {...subField}
                      component={Input}
                      name={`${field.name}[${index}].${subField.name}`}
                      key={`${field.name}[${index}].${subField.name}`}
                    />
                  )
                })}

                <Button
                  style="primary"
                  type="button"
                  size="small"
                  onClick={() => {
                    deleteParameter(index)
                  }}
                >
                  Delete parameter
                </Button>
              </div>
            )
          }
        })}
      />
    </div>
  )
}
