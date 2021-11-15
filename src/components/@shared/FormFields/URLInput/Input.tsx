import React, { ReactElement } from 'react'
import Button from '@shared/atoms/Button'
import { FieldInputProps, useField } from 'formik'
import Loader from '@shared/atoms/Loader'
import styles from './Input.module.css'
import InputGroup from '@shared/FormInput/InputGroup'

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
  const isButtonDisabled =
    !field.value || field.value.length === 0 || field.value === ''

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
        disabled={isButtonDisabled}
      >
        {isLoading ? <Loader /> : submitText}
      </Button>
    </InputGroup>
  )
}
