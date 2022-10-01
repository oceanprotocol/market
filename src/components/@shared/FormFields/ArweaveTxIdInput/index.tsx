import React, { ReactElement, useState } from 'react'
import { useField, useFormikContext } from 'formik'
import FileInfo from './Info'
import UrlInput from '../URLInput'
import { InputProps } from '@shared/FormInput'
import { getFileUrlInfo } from '@utils/provider'
import { FormPublishData } from 'src/components/Publish/_types'
import { Arweave, LoggerInstance } from '@oceanprotocol/lib'
import { useAsset } from '@context/Asset'

export default function ArweaveTxIdInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const { values, setFieldError } = useFormikContext<FormPublishData>()
  const { asset } = useAsset()

  async function handleValidation(
    e: React.SyntheticEvent,
    transactionId: string
  ) {
    // File example 'https://oceanprotocol.com/tech-whitepaper.pdf'
    e.preventDefault()

    try {
      const providerUrl = values?.services
        ? values?.services[0].providerUrl.url
        : asset.services[0].serviceEndpoint
      setIsLoading(true)
      const arweaveFile: Arweave = {
        type: 'arweave',
        transactionId: transactionId
      }
      const checkedFile = await getFileUrlInfo(arweaveFile, providerUrl)

      // error if something's not right from response
      if (!checkedFile)
        throw Error('Could not fetch file info. Is your network down?')

      if (checkedFile[0].valid === false)
        throw Error('✗ No valid file detected. Check your URL and try again.')

      // if all good, add file to formik state
      helpers.setValue([{ transactionId, ...checkedFile[0] }])
    } catch (error) {
      setFieldError(`${field.name}[0].transactionId`, error.message)
      LoggerInstance.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleClose() {
    helpers.setValue(meta.initialValue)
    helpers.setTouched(false)
  }

  return (
    <>
      {field?.value?.[0]?.valid === true ? (
        <FileInfo file={field.value[0]} handleClose={handleClose} />
      ) : (
        <UrlInput
          submitText="Validate"
          {...props}
          name={`${field.name}[0].url`}
          isLoading={isLoading}
          handleButtonClick={handleValidation}
        />
      )}
    </>
  )
}
