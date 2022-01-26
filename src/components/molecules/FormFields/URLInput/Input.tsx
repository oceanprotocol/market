import React, { ReactElement, useEffect, useState } from 'react'
import Button from '../../../atoms/Button'
import { FieldInputProps, useField } from 'formik'
import Loader from '../../../atoms/Loader'
import styles from './Input.module.css'
import InputGroup from '../../../atoms/Input/InputGroup'
import isUrl from 'is-url-superb'

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

  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  useEffect(() => {
    if (!field?.value) return

    setIsButtonDisabled(
      !field?.value ||
        field.value === '' ||
        !isUrl(field.value) ||
        field.value.includes('javascript:') ||
        meta?.error
    )
  }, [field?.value, meta?.error])

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
