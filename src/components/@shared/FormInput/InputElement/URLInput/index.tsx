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
  storageType?: string
}

export default function URLInput({
  submitText,
  handleButtonClick,
  isLoading,
  name,
  checkUrl,
  storageType,
  ...props
}: URLInputProps): ReactElement {
  const [field, meta] = useField(name)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  useEffect(() => {
    if (!field?.value) return

    const isCid = (value: string) => {
      // check if url
      if (isUrl(value)) return true

      // regex cid. https://stackoverflow.com/questions/67176725/a-regex-json-schema-pattern-for-an-ipfs-cid
      const cidRegex =
        'Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}'

      return cidRegex.match(value)
    }

    setIsButtonDisabled(
      !field?.value ||
        field.value === '' ||
        (checkUrl && storageType === 'url' && !isUrl(field.value)) ||
        (checkUrl && storageType === 'ipfs' && isCid(field.value)) ||
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
