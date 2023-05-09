import React, { ReactElement, useEffect, useState } from 'react'
import { useField } from 'formik'
import { InputProps } from '../..'
import { ConsumerParameter } from '../../../../Publish/_types'
import Tabs from '../../../atoms/Tabs'
import FormActions from './FormActions'
import DefaultInput from './DefaultInput'
import SelectInput from './SelectInput'
import ConsumerParameterInput from './Input'
import styles from './index.module.css'

export const defaultConsumerParam: ConsumerParameter = {
  name: '',
  label: '',
  description: '',
  type: 'text',
  options: [],
  default: '',
  required: ''
}

export const paramTypes: ConsumerParameter['type'][] = [
  'number',
  'text',
  'boolean',
  'select'
]

export function ConsumerParameters(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField<ConsumerParameter[]>(props.name)

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
            title: param?.name || 'New parameter',
            content: (
              <div>
                {props.fields?.map((subField: InputProps) => {
                  if (subField.name === 'options') {
                    return field.value[index]?.type === 'select' ? (
                      <SelectInput
                        key={`${field.name}[${index}].${props.name}`}
                        {...subField}
                        index={index}
                        inputName={props.name}
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

                  return (
                    <ConsumerParameterInput
                      key={`${field.name}[${index}].${subField.name}`}
                      {...subField}
                      name={`${field.name}[${index}].${subField.name}`}
                      index={index}
                      inputName={props.name}
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
