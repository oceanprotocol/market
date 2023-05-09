import { Field, useField, useFormikContext } from 'formik'
import React, { ReactElement, useEffect } from 'react'
import Input, { InputProps } from '../..'
import {
  AlgorithmConsumerParameter,
  FormPublishData
} from '../../../../Publish/_types'
import Tabs from '../../../atoms/Tabs'
import styles from './index.module.css'
import FormActions from './FormActions'
import DefaultInput from './DefaultInput'
import SelectInput from './SelectInput'

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
  const { setFieldTouched } = useFormikContext<FormPublishData>()

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
                        fieldName={props.name}
                      />
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
