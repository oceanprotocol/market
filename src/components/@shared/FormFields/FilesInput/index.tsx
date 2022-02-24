import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useField, useFormikContext } from 'formik'
import { toast } from 'react-toastify'
import FileInfo from './Info'
import UrlInput from '../URLInput'
import { InputProps } from '@shared/FormInput'
import { initialValues } from 'src/components/Publish/_constants'
import { getFileUrlInfo } from '@utils/provider'
import { FormPublishData } from 'src/components/Publish/_types'

export default function FilesInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const { values } = useFormikContext<FormPublishData>()

  const loadFileInfo = useCallback(
    (url: string) => {
      const providerUri =
        (values.services && values.services[0].providerUrl.url) ||
        'https://provider.mainnet.oceanprotocol.com'

      async function validateUrl() {
        try {
          setIsLoading(true)
          const checkedFile = await getFileUrlInfo(url, providerUri)
          checkedFile && helpers.setValue([{ url, ...checkedFile[0] }])
        } catch (error) {
          toast.error(
            'Could not fetch file info. Please check URL and try again'
          )
          console.error(error.message)
        } finally {
          setIsLoading(false)
        }
      }

      validateUrl()
    },
    [helpers, values.services]
  )

  useEffect(() => {
    // try load from initial values, kinda hacky but it works
    if (
      props.value &&
      props.value.length > 0 &&
      typeof props.value[0] === 'string'
    ) {
      console.log('loadFileInfo eff')
      loadFileInfo(props.value[0].toString())
    }
  }, [loadFileInfo, props])

  async function handleButtonClick(e: React.SyntheticEvent, url: string) {
    // File example 'https://oceanprotocol.com/tech-whitepaper.pdf'
    e.preventDefault()
    loadFileInfo(url)
  }

  function handleClose() {
    helpers.setValue(initialValues.services[0].files)
    helpers.setTouched(false)
  }

  return (
    <>
      {field?.value?.length &&
      field.value[0].url !== '' &&
      field.value[0].valid ? (
        <FileInfo file={field.value[0]} handleClose={handleClose} />
      ) : (
        <UrlInput
          submitText="Validate"
          {...props}
          name={`${field.name}[0].url`}
          hasError={Boolean(meta.touched && meta.error)}
          isLoading={isLoading}
          handleButtonClick={handleButtonClick}
        />
      )}
    </>
  )
}
