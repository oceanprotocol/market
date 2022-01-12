import React, { ReactElement, useState } from 'react'
import { useField } from 'formik'
import { toast } from 'react-toastify'
import FileInfo from './Info'
import UrlInput from '../URLInput'
import { InputProps } from '@shared/FormInput'
import { useWeb3 } from '@context/Web3'
import { getOceanConfig } from '@utils/ocean'
import { initialValues } from 'src/components/Publish/_constants'
import { getFileInfo } from '@utils/provider'

export default function FilesInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const { chainId } = useWeb3()

  function loadFileInfo(url: string) {
    const config = getOceanConfig(chainId || 1)

    async function validateUrl() {
      try {
        setIsLoading(true)
        const checkedFile = await getFileInfo(url, config.providerUri)
        checkedFile && helpers.setValue([{ url, ...checkedFile[0] }])
      } catch (error) {
        toast.error('Could not fetch file info. Please check URL and try again')
        console.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    validateUrl()
  }

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
