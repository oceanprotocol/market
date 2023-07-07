import React, { ReactElement, useEffect, useState } from 'react'
import { Field, useField } from 'formik'
import Input, { InputProps } from '../..'
import { FormConsumerParameter } from '@components/Publish/_types'
import Tabs from '@shared/atoms/Tabs'
import FormActions from './FormActions'
import DefaultInput from './DefaultInput'
import OptionsInput from './OptionsInput'
import styles from './index.module.css'
import TypeInput from './TypeInput'

export const defaultConsumerParam: FormConsumerParameter = {
  name: '',
  label: '',
  description: '',
  type: 'text',
  options: undefined,
  default: '',
  required: 'optional'
}

export const paramTypes: FormConsumerParameter['type'][] = [
  'number',
  'text',
  'boolean',
  'select'
]

export function ConsumerParameters(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField<FormConsumerParameter[]>(props.name)

  const [tabIndex, setTabIndex] = useState(0)

  useEffect(() => {
    if (field.value.length === 0)
      helpers.setValue([{ ...defaultConsumerParam }])
  }, [])

  return (
    <div className={styles.container}>
      <Tabs
        selectedIndex={tabIndex}
        onIndexSelected={setTabIndex}
        items={field.value.map((param, index) => {
          return {
            title:
              param?.name?.length > 15
                ? `${param?.name?.slice(0, 15)}...`
                : param?.name || 'New parameter',
            content: (
              <div>
                {props.fields?.map((subField: InputProps) => {
                  if (subField.name === 'options') {
                    return field.value[index]?.type === 'select' ? (
                      <OptionsInput
                        key={`${field.name}[${index}].${props.name}`}
                        {...subField}
                        name={`${field.name}[${index}].${subField.name}`}
                        value={field.value[index][subField.name]}
                      />
                    ) : null
                  }

                  if (subField.name === 'default') {
                    return (
                      <DefaultInput
                        key={`${field.name}[${index}].${subField.name}`}
                        {...subField}
                        name={`${field.name}[${index}].${subField.name}`}
                        index={index}
                        inputName={props.name}
                      />
                    )
                  }

                  if (subField.name === 'type') {
                    return (
                      <TypeInput
                        key={`${field.name}[${index}].${subField.name}`}
                        {...subField}
                        name={`${field.name}[${index}].${subField.name}`}
                        index={index}
                        inputName={props.name}
                      />
                    )
                  }

                  return (
                    <Field
                      key={`${field.name}[${index}].${subField.name}`}
                      {...subField}
                      name={`${field.name}[${index}].${subField.name}`}
                      component={Input}
                    />
                  )
                })}
                <FormActions
                  fieldName={props.name}
                  index={index}
                  onParameterAdded={setTabIndex}
                  onParameterDeleted={setTabIndex}
                />
              </div>
            )
          }
        })}
      />
    </div>
  )
}
