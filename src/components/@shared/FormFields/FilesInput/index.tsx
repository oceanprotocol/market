import React, { ReactElement, useState } from 'react'
import { useField, useFormikContext } from 'formik'
import FileInfo from './Info'
import UrlInput from '../URLInput'
import { InputProps } from '@shared/FormInput'
import { initialValues } from 'src/components/Publish/_constants'
import { getFileUrlInfo } from '@utils/provider'
import { FormPublishData } from 'src/components/Publish/_types'
import { LoggerInstance } from '@oceanprotocol/lib'

export default function FilesInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isInvalidUrl, setIsInvalidUrl] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { values } = useFormikContext<FormPublishData>()

  async function handleValidation(e: React.SyntheticEvent, url: string) {
    // File example 'https://oceanprotocol.com/tech-whitepaper.pdf'
    e.preventDefault()

    try {
      const providerUrl = values?.services[0].providerUrl.url
      setIsLoading(true)
      const checkedFile = await getFileUrlInfo(url, providerUrl)
      setIsInvalidUrl(!checkedFile[0].valid)
      checkedFile && helpers.setValue([{ url, ...checkedFile[0] }])
    } catch (error) {
      helpers.setError(
        'Could not fetch file info. Please check URL and try again'
      )
      LoggerInstance.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleClose() {
    helpers.setValue(initialValues.services[0].files)
    helpers.setTouched(false)
  }

  return (
    <>
      {field?.value && field?.value[0]?.valid !== undefined ? (
        <FileInfo file={field.value[0]} handleClose={handleClose} />
      ) : (
        <UrlInput
          submitText="Validate"
          {...props}
          name={`${field.name}[0].url`}
          hasError={Boolean(meta.touched && isInvalidUrl)}
          isLoading={isLoading}
          handleButtonClick={handleValidation}
        />
      )}
    </>
  )
}
