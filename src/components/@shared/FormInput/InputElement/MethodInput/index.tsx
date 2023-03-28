import React, { ReactElement, useEffect, useState } from 'react'
import Button from '@shared/atoms/Button'
import { ErrorMessage, useField } from 'formik'
import Loader from '@shared/atoms/Loader'
import styles from './index.module.css'
import InputGroup from '@shared/FormInput/InputGroup'
import InputElement from '@shared/FormInput/InputElement'
import isUrl from 'is-url-superb'
import { isCID } from '@utils/ipfs'

export interface MethodInputProps {
  handleButtonClick(method: string): void
  isLoading: boolean
  name: string
  checkUrl?: boolean
  storageType?: string
  hideButton?: boolean
}

export default function MethodInput({
  handleButtonClick,
  isLoading,
  name,
  checkUrl,
  storageType,
  ...props
}: MethodInputProps): ReactElement {
  const [field, meta] = useField(name)
  const [methodSelected, setMethod] = useState(field?.value[0]?.method || 'get')

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

        <InputElement
          className={`${styles.inputMethod} ${
            !isLoading && meta.error !== undefined && meta.touched
              ? styles.hasError
              : ''
          }`}
          name={`${field.name}[0].method`}
          value={methodSelected}
          onChange={(e) => {
            setMethod(e.currentTarget.value)
            handleButtonClick(e.currentTarget.value)
          }}
          type="select"
          options={['get', 'post']}
        />
      </InputGroup>

      {meta.touched && meta.error && (
        <div className={styles.error}>
          <ErrorMessage name={field.name} />
        </div>
      )}
    </>
  )
}
