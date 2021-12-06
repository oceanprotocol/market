import React, { ReactElement } from 'react'
import Button from '@shared/atoms/Button'
import { ErrorMessage, useField } from 'formik'
import Loader from '@shared/atoms/Loader'
import styles from './index.module.css'
import InputGroup from '@shared/FormInput/InputGroup'
import InputElement from '@shared/FormInput/InputElement'

export default function URLInput({
  submitText,
  handleButtonClick,
  isLoading,
  name,
  hasError,
  ...props
}: {
  submitText: string
  handleButtonClick(e: React.SyntheticEvent, data: string): void
  isLoading: boolean
  name: string
  hasError: boolean
}): ReactElement {
  const [field, meta] = useField(name)
  const isButtonDisabled = !field?.value || field.value === ''

  return (
    <>
      <InputGroup>
        <InputElement
          className={`${styles.input} ${
            !isLoading && hasError ? styles.hasError : ''
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
