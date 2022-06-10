// Copyright Ocean Protocol contributors
// SPDX-License-Identifier: Apache-2.0
import React, { ReactElement, useState, useEffect } from 'react'
import { useField, useFormikContext } from 'formik'
import FileInfo from './Info'
import UrlInput from '../URLInput'
import DragAndDrop from './DragAndDrop'
import { InputProps } from '@shared/FormInput'
import { getFileUrlInfo } from '@utils/provider'
import { FormPublishData } from 'src/components/Publish/_types'
import { LoggerInstance } from '@oceanprotocol/lib'
import { useAsset } from '@context/Asset'

export default function FilesInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const { values, setFieldError } = useFormikContext<FormPublishData>()
  const { asset } = useAsset()

  async function handleValidation(e: React.SyntheticEvent, url: string) {
    // File example 'https://oceanprotocol.com/tech-whitepaper.pdf'
    e.preventDefault()

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
    helpers.setValue(meta.initialValue)
    helpers.setTouched(false)
  }

  function onFileDrop(_files: File[]) {
    const validSize = _files[0].size < 2 ** 32 // make sure file is small enough for a single Filecoin deal
    const validType = _files[0].type.length > 0
    const checkedFile = {
      contentLength: _files[0].size,
      contentType: _files[0].type,
      index: 0,
      valid: validSize && validType
    }
    if (!validSize) {
      setFieldError(
        `${field.name}[0].file`,
        'File size must be less than 32GiB.'
      )
    }
    if (!validType) {
      setFieldError(`${field.name}[0].file`, 'Unknown file type.')
    }
    helpers.setValue([{ file: _files[0], ...checkedFile }])
  }

  return (
    <>
      {field?.value?.[0]?.valid === true ? (
        <FileInfo file={field.value[0]} handleClose={handleClose} />
      ) : (
        <div>
          <UrlInput
            submitText="Validate"
            {...props}
            name={`${field.name}[0].url`}
            isLoading={isLoading}
            handleButtonClick={handleValidation}
          />
          <DragAndDrop {...props} onFileDrop={onFileDrop} />
        </div>
      )}
    </>
  )
}
