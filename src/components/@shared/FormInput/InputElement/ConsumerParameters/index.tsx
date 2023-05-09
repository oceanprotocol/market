import { useField } from 'formik'
import React, { ReactElement, useEffect } from 'react'
import { InputProps } from '../..'
import { AlgorithmConsumerParameter } from '../../../../Publish/_types'
import Tabs from '../../../atoms/Tabs'
import styles from './index.module.css'
import FormActions from './FormActions'
import DefaultInput from './DefaultInput'
import SelectInput from './SelectInput'
import ConsumerParameterInput from './Input'

export const defaultConsumerParam: AlgorithmConsumerParameter = {
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
  const [field, meta, helpers] = useField<AlgorithmConsumerParameter[]>(
    props.name
  )

  useEffect(() => {
    if (field.value.length === 0)
      helpers.setValue([{ ...defaultConsumerParam }])
  }, [])

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
                <FormActions fieldName={props.name} index={index} />
              </div>
            )
          }
        })}
      />
    </div>
  )
}
