import React, { ReactElement, useState } from 'react'
import { useField, useFormikContext } from 'formik'
import UrlInput from '../URLInput'
import { InputProps } from '@shared/FormInput'
import FileInfo from '../FilesInput/Info'
import styles from './index.module.css'
import Button from '@shared/atoms/Button'
import { initialValues } from 'src/components/Publish/_constants'
import { LoggerInstance, ProviderInstance } from '@oceanprotocol/lib'
import { FormPublishData } from 'src/components/Publish/_types'
import { getOceanConfig } from '@utils/ocean'
import { useWeb3 } from '@context/Web3'

export default function CustomProvider(props: InputProps): ReactElement {
  const { chainId } = useWeb3()
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const { setFieldError } = useFormikContext<FormPublishData>()

  async function handleValidation(e: React.SyntheticEvent) {
    e.preventDefault()

    try {
      setIsLoading(true)
      const isValid = await ProviderInstance.isValidProvider(field.value.url)

      // error if something's not right from response
      // No way to detect a failed request with ProviderInstance.isValidProvider,
      // making this error show up for multiple cases it shouldn't, like network
      // down.
      if (!isValid)
        throw Error(
          '✗ No valid provider detected. Check your network, your URL and try again.'
        )

      // if all good, add provider to formik state
      helpers.setValue({ url: field.value.url, valid: isValid, custom: true })
    } catch (error) {
      setFieldError(`${field.name}.url`, error.message)
      LoggerInstance.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleFileInfoClose() {
    helpers.setValue({ url: '', valid: false, custom: true })
    helpers.setTouched(false)
  }

  function handleDefault(e: React.SyntheticEvent) {
    e.preventDefault()

    const oceanConfig = getOceanConfig(chainId)
    const providerUrl =
      oceanConfig?.providerUri || initialValues.services[0].providerUrl.url

    helpers.setValue({ url: providerUrl, valid: true, custom: false })
  }

  return field?.value?.valid === true ? (
    <FileInfo file={field.value} handleClose={handleFileInfoClose} />
  ) : (
    <>
      <UrlInput
        submitText="Validate"
        {...props}
        name={`${field.name}.url`}
        isLoading={isLoading}
        handleButtonClick={handleValidation}
      />
      <Button
        style="text"
        size="small"
        onClick={handleDefault}
        className={styles.default}
      >
        Use Default Provider
      </Button>
    </>
  )
}
