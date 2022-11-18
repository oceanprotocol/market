import React, { ReactElement, useState } from 'react'
import { useField } from 'formik'
import FileInfo from './Info'
import UrlInput from '../URLInput'
import { InputProps } from '@shared/FormInput'
import { getFileUrlInfo } from '@utils/provider'
import { LoggerInstance } from '@oceanprotocol/lib'
import { useAsset } from '@context/Asset'

export default function FilesInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const { asset } = useAsset()

  async function handleValidation(e: React.SyntheticEvent, url: string) {
    // File example 'https://oceanprotocol.com/tech-whitepaper.pdf'
    e?.preventDefault()

    try {
      const providerUrl = props.form?.values?.services
        ? props.form?.values?.services[0].providerUrl.url
        : asset.services[0].serviceEndpoint
      setIsLoading(true)

      // TODO: handled on provider
      if (url.includes('drive.google')) {
        throw Error(
          'Google Drive is not a supported hosting service. Please use an alternative.'
        )
      }

      const checkedFile = await getFileUrlInfo(url, providerUrl)

      // error if something's not right from response
      if (!checkedFile)
        throw Error('Could not fetch file info. Is your network down?')

      if (checkedFile[0].valid === false)
        throw Error('✗ No valid file detected. Check your URL and try again.')

      // if all good, add file to formik state
      helpers.setValue([{ url, ...checkedFile[0] }])
    } catch (error) {
      props.form.setFieldError(`${field.name}[0].url`, error.message)
      LoggerInstance.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleClose() {
    helpers.setTouched(false)
    helpers.setValue(meta.initialValue)
  }

  return (
    <>
      {field?.value?.[0]?.valid === true ||
      field?.value?.[0]?.type === 'hidden' ? (
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
