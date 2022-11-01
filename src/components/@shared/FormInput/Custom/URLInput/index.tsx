import React, { ReactElement, useEffect, useState } from 'react'
import Button from '@shared/atoms/Button'
import { ErrorMessage, useField } from 'formik'
import Loader from '@shared/atoms/Loader'
import styles from './index.module.css'
import InputGroup from '@shared/FormInput/InputGroup'
import InputElement from '@shared/FormInput/InputElement'
import isUrl from 'is-url-superb'

export interface URLInputProps {
  submitText: string
  handleButtonClick(e: React.SyntheticEvent, data: string): void
  isLoading: boolean
  name: string
  checkUrl?: boolean
}

export default function URLInput({
  submitText,
  handleButtonClick,
  isLoading,
  name,
  checkUrl,
  ...props
}: URLInputProps): ReactElement {
  const [field, meta] = useField(name)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  useEffect(() => {
    if (!field?.value) return

    setIsButtonDisabled(
      !field?.value ||
        field.value === '' ||
        (checkUrl && !isUrl(field.value)) ||
        field.value.includes('javascript:') ||
        meta?.error
    )
  }, [field?.value, meta?.error])

  return (
    <>
      <InputGroup>
        <InputElement
          className={`${styles.input} ${
            !isLoading && meta.error !== undefined && meta.touched
              ? styles.hasError
              : ''
          }`}
          {...props}
          {...field}
          type="url"
        />

        <Button
          style="primary"
          size="small"
          onClick={(e: React.SyntheticEvent) => {
            e.preventDefault()
            handleButtonClick(e, field.value)
          }}
          disabled={isButtonDisabled}
        >
          {isLoading ? <Loader /> : submitText}
        </Button>
      </InputGroup>

      {meta.touched && meta.error && (
        <div className={styles.error}>
          <ErrorMessage name={field.name} />
        </div>
      )}
    </>
  )
}
