import React, { ReactElement, useState, useEffect } from 'react'
import { useField } from 'formik'
import { toast } from 'react-toastify'
import CustomInput from './URLInput/Input'
import { useOcean } from '../../../providers/Ocean'
import { InputProps } from '../../atoms/Input'
import { Ocean } from '@oceanprotocol/lib'

export default function CustomProvider(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const [providerUrl, setProviderUrl] = useState<string>()
  const { config } = useOcean()

  function loadProvider() {
    if (!providerUrl) return
    async function validateProvider() {
      let valid: boolean
      try {
        setIsLoading(true)
        const ocean: Ocean = await Ocean.getInstance(config)
        console.log('ocean', ocean)
        valid = await ocean.provider.isValidProvider(providerUrl)
        console.log('valid', valid)
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
  }, [providerUrl, config.providerUri])

  async function handleButtonClick(e: React.SyntheticEvent, url: string) {
    // hack so the onBlur-triggered validation does not show,
    // like when this field is required
    helpers.setTouched(false)

    // File example 'https://oceanprotocol.com/tech-whitepaper.pdf'
    e.preventDefault()

    // In the case when the user re-add the same URL after it was removed (by accident or intentionally)
    if (providerUrl === url) {
      loadProvider()
    }

    setProviderUrl(url)
  }

  return (
    <CustomInput
      submitMessage="Validate"
      {...props}
      {...field}
      isLoading={isLoading}
      handleButtonClick={handleButtonClick}
    />
  )
}
