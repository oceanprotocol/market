import React, { ReactElement } from 'react'
import Button from '@shared/atoms/Button'
import styles from './FormActions.module.css'
import { useField, useFormikContext } from 'formik'
import {
  FormConsumerParameter,
  FormPublishData
} from '@components/Publish/_types'
import { getObjectPropertyByPath } from '@utils/index'
import { defaultConsumerParam } from '.'
import { toast } from 'react-toastify'

export default function FormActions({
  fieldName,
  index,
  onParameterAdded,
  onParameterDeleted
}: {
  fieldName: string
  index: number
  onParameterAdded?: (index: number) => void
  onParameterDeleted?: (previousIndex: number) => void
}): ReactElement {
  const { errors, setFieldTouched, validateField } =
    useFormikContext<FormPublishData>()
  const [field, meta, helpers] = useField<FormConsumerParameter[]>(fieldName)

  const setParamPropsTouched = (index: number, touched = true) => {
    Object.keys(defaultConsumerParam).forEach((param) => {
      setFieldTouched(`${field.name}[${index}].${param}`, touched)
    })
  }

  const addParameter = (index: number) => {
    // validate parameter before allowing the creation of a new one
    validateField(field.name)
    setParamPropsTouched(index)

    // Check errors on current tab before creating a new param
    if (getObjectPropertyByPath(errors, `${field.name}[${index}]`)) {
      toast.error(
        'Cannot add new parameter. Current parameter definition contains errors.'
      )
      return
    }

    helpers.setValue([...field.value, { ...defaultConsumerParam }])

    onParameterAdded && onParameterAdded(field.value.length)
  }

  const deleteParameter = (index: number) => {
    helpers.setValue(field.value.filter((p, i) => i !== index))

    const previousIndex = Math.max(0, index - 1)
    onParameterDeleted && onParameterDeleted(previousIndex)
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
