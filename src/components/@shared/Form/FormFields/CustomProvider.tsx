import React, { ReactElement, useState, useEffect } from 'react'
import { useField } from 'formik'
import { toast } from 'react-toastify'
import CustomInput from './URLInput/Input'
import { useOcean } from '@context/Ocean'
import { InputProps } from '@shared/Form/Input'

export default function CustomProvider(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const [providerUrl, setProviderUrl] = useState<string>()
  const { ocean, config } = useOcean()

  function loadProvider() {
    if (!providerUrl) return
    async function validateProvider() {
      let valid: boolean
      try {
        setIsLoading(true)
        valid = await ocean.provider.isValidProvider(providerUrl)
      } catch (error) {
        valid = false
        console.error(error.message)
      } finally {
        valid
          ? toast.success('Perfect! That provider URL looks good 🐳')
          : toast.error(
              'Could not validate provider. Please check URL and try again'
            )

        setIsLoading(false)
      }
    }
    validateProvider()
  }

  useEffect(() => {
    loadProvider()
  }, [providerUrl, config?.providerUri])

  async function handleButtonClick(e: React.SyntheticEvent, url: string) {
    helpers.setTouched(false)
    e.preventDefault()
    if (providerUrl === url) {
      loadProvider()
    }

    setProviderUrl(url)
  }

  return (
    <CustomInput
      submitText="Validate"
      {...props}
      {...field}
      isLoading={isLoading}
      handleButtonClick={handleButtonClick}
    />
  )
}
