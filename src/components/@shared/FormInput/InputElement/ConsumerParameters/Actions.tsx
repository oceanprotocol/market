import React, { ReactElement } from 'react'
import Button from '@components/@shared/atoms/Button'
import styles from './Actions.module.css'
import { useField, useFormikContext } from 'formik'
import {
  AlgorithmConsumerParameter,
  FormPublishData
} from '@components/Publish/_types'
import { getObjectPropertyByPath } from '@utils/index'

const defaultParam: AlgorithmConsumerParameter = {
  name: '',
  label: '',
  description: '',
  type: 'text',
  options: [],
  default: '',
  required: ''
}

export default function Actions({
  fieldName,
  index
}: {
  fieldName: string
  index: number
}): ReactElement {
  const { errors, setFieldTouched, validateField } =
    useFormikContext<FormPublishData>()
  const [field, meta, helpers] =
    useField<AlgorithmConsumerParameter[]>(fieldName)

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

  return (
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
  )
}
