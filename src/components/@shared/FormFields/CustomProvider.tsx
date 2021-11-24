import React, { ReactElement, useState } from 'react'
import { useField } from 'formik'
import UrlInput from './URLInput'
import { useOcean } from '@context/Ocean'
import { InputProps } from '@shared/FormInput'

export default function CustomProvider(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const { ocean, config } = useOcean()

  async function validateProvider(url: string) {
    setIsLoading(true)

    try {
      const isValid = await ocean.provider.isValidProvider(url)
      setIsValid(isValid)
      helpers.setError(undefined)
    } catch (error) {
      setIsValid(false)
      helpers.setError(
        'Could not validate provider. Please check URL and try again'
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleButtonClick(e: React.SyntheticEvent, url: string) {
    e.preventDefault()
    validateProvider(url)
  }

  return (
    <UrlInput
      submitText="Validate"
      isValid={isValid}
      {...props}
      {...field}
      isLoading={isLoading}
      handleButtonClick={handleButtonClick}
    />
  )
}
