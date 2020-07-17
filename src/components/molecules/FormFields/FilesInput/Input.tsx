import React, { ReactElement } from 'react'
import isUrl from 'is-url-superb'
import Button from '../../../atoms/Button'
import { useField } from 'formik'
import Loader from '../../../atoms/Loader'
import { InputProps } from '../../../atoms/Input'
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
  const [field, meta] = useField(props as InputProps)

  return (
    <InputGroup>
      <input className={styles.input} {...props} type="url" />

      <Button
        size="small"
        onClick={(e: React.SyntheticEvent) => handleButtonClick(e, field.value)}
        disabled={
          !field.value ||
          // weird static page build fix so is-url-superb won't error
          !isUrl(typeof field.value === 'string' ? field.value : '')
        }
      >
        {isLoading ? <Loader /> : 'Add File'}
      </Button>
    </InputGroup>
  )
}
