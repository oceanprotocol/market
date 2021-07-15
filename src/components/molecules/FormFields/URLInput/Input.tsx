import React, { ReactElement } from 'react'
import Button from '../../../atoms/Button'
import { FieldInputProps, useField } from 'formik'
import Loader from '../../../atoms/Loader'
import styles from './Input.module.css'
import InputGroup from '../../../atoms/Input/InputGroup'

export default function URLInput({
  submitText,
  handleButtonClick,
  isLoading,
  ...props
}: {
  submitText: string
  handleButtonClick(e: React.SyntheticEvent, data: string): void
  isLoading: boolean
}): ReactElement {
  const [field, meta] = useField(props as FieldInputProps<any>)

  return (
    <InputGroup>
      <input
        className={styles.input}
        {...props}
        type="url"
        onBlur={(e: React.SyntheticEvent) => handleButtonClick(e, field.value)}
      />

      <Button
        style="primary"
        size="small"
        onClick={(e: React.SyntheticEvent) => e.preventDefault()}
        disabled={!field.value}
      >
        {isLoading ? <Loader /> : `${submitText}`}
      </Button>
    </InputGroup>
  )
}
