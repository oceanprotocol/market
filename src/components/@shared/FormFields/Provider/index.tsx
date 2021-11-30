import React, { ReactElement, useState } from 'react'
import { ErrorMessage, useField } from 'formik'
import UrlInput from '../URLInput'
import { useOcean } from '@context/Ocean'
import { InputProps } from '@shared/FormInput'
import FileInfo from '../FilesInput/Info'
import styles from './index.module.css'
import Button from '@shared/atoms/Button'
import { initialValues } from 'src/components/Publish/_constants'

export default function CustomProvider(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const { ocean, config } = useOcean()

  async function validateProvider(url: string) {
    setIsLoading(true)

    try {
      // TODO: #948 Remove ocean.provider.isValidProvider dependency.
      const isValid = await ocean.provider.isValidProvider(url)
      helpers.setValue({ url, valid: isValid })
      helpers.setError(undefined)
    } catch (error) {
      helpers.setError(
        'Could not validate provider. Please check URL and try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleValidateButtonClick(
    e: React.SyntheticEvent,
    url: string
  ) {
    e.preventDefault()
    validateProvider(url)
  }

  function handleFileInfoClose() {
    helpers.setValue({ url: '', valid: false })
    helpers.setTouched(false)
  }

  function handleRestore(e: React.SyntheticEvent) {
    e.preventDefault()
    helpers.setValue(initialValues.services[0].providerUrl)
  }

  return field?.value?.valid ? (
    <FileInfo file={field.value} handleClose={handleFileInfoClose} />
  ) : (
    <>
      <UrlInput
        submitText="Validate"
        {...props}
        name={`${field.name}.url`}
        hasError={Boolean(meta.touched && meta.error)}
        isLoading={isLoading}
        handleButtonClick={handleValidateButtonClick}
      />
      <Button
        style="text"
        size="small"
        onClick={handleRestore}
        className={styles.restore}
      >
        Use Default Provider
      </Button>
      {typeof meta.error === 'string' && meta.touched && meta.error && (
        <div className={styles.error}>
          <ErrorMessage name={field.name} />
        </div>
      )}
    </>
  )
}
