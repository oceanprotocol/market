import React, { ReactElement } from 'react'
import validUrlUtf8 from 'valid-url-utf8'
import Button from '../../../atoms/Button'
import { FieldInputProps, useField } from 'formik'
import Loader from '../../../atoms/Loader'
import styles from './Input.module.css'
import InputGroup from '../../../atoms/Input/InputGroup'

export default function FileInput({
  handleButtonClick,
  isLoading,
  ...props
}: {
  handleButtonClick(e: React.SyntheticEvent, data: string): void
  isLoading: boolean
}): ReactElement {
  const [field, meta] = useField(props as FieldInputProps<any>)

  return (
    <InputGroup>
      <input className={styles.input} {...props} type="url" />

      <Button
        size="small"
        onClick={(e: React.SyntheticEvent) => handleButtonClick(e, field.value)}
        disabled={!field.value || !validUrlUtf8(field.value)}
      >
        {isLoading ? <Loader /> : 'Add File'}
      </Button>
    </InputGroup>
  )
}
