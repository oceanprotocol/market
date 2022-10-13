import React, { ReactElement, useEffect, useState } from 'react'
import { useField, useFormikContext } from 'formik'
import FileInfo from './Info'
import UrlInput from '../URLInput'
import { InputProps } from '@shared/FormInput'
import { getFileDidInfo, getFileUrlInfo } from '@utils/provider'
import { FormPublishData } from 'src/components/Publish/_types'
import { LoggerInstance } from '@oceanprotocol/lib'
import { useAsset } from '@context/Asset'

export default function FilesInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const [hideUrl, setHideUrl] = useState(false)
  const { values, setFieldError } = useFormikContext<FormPublishData>()
  const { asset } = useAsset()

  async function handleValidation(e: React.SyntheticEvent, url: string) {
    // File example 'https://oceanprotocol.com/tech-whitepaper.pdf'
    e?.preventDefault()

    try {
      const providerUrl = values?.services
        ? values?.services[0].providerUrl.url
        : asset.services[0].serviceEndpoint
      setIsLoading(true)
      const checkedFile = await getFileUrlInfo(url, providerUrl)

      // error if something's not right from response
      if (!checkedFile)
        throw Error('Could not fetch file info. Is your network down?')

      if (checkedFile[0].valid === false)
        throw Error('✗ No valid file detected. Check your URL and try again.')

      // if all good, add file to formik state
      helpers.setValue([{ url, ...checkedFile[0] }])
    } catch (error) {
      setFieldError(`${field.name}[0].url`, error.message)
      LoggerInstance.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleClose() {
    helpers.setTouched(false)
    helpers.setValue(meta.initialValue)
  }

  useEffect(() => {
    if (field.name === 'links' && asset?.metadata?.links) {
      handleValidation(null, asset.metadata.links[0])
    } else if (field.name === 'files') {
      getFileDidInfo(
        asset?.id,
        asset?.services[0]?.id,
        asset?.services[0]?.serviceEndpoint
      ).then((fileDidInfo) => {
        setHideUrl(true)
        // setting placeholder for url file to avoid txs for the url file during initializing
        helpers.setValue([
          {
            url: fileDidInfo[0].valid
              ? 'http://oceanprotocol.com/placeholder'
              : '',
            ...fileDidInfo[0]
          }
        ])
      })
    }
  }, [])

  return (
    <>
      {field?.value?.[0]?.valid === true ? (
        <FileInfo
          hideUrl={hideUrl}
          file={field.value[0]}
          handleClose={handleClose}
        />
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
