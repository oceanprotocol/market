import React, { ReactElement, useState } from 'react'
import { useField } from 'formik'
import { toast } from 'react-toastify'
import FileInfo from './Info'
import UrlInput from '../URLInput'
import { InputProps } from '@shared/FormInput'
import { getFileInfo } from '@utils/provider'
import { useWeb3 } from '@context/Web3'
import { getOceanConfig } from '@utils/ocean'
import { useCancelToken } from '@hooks/useCancelToken'

export default function FilesInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const { chainId } = useWeb3()
  const newCancelToken = useCancelToken()

  function loadFileInfo(url: string) {
    const config = getOceanConfig(chainId || 1)

    async function validateUrl() {
      try {
        setIsLoading(true)
        const checkedFile = await getFileInfo(
          url,
          config?.providerUri,
          newCancelToken()
        )
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

  return (
    <>
      {field?.value && field.value[0].url !== '' && field.value[0].valid ? (
        <FileInfo name={props.name} file={field.value[0]} />
      ) : (
        <UrlInput
          submitText="Add File"
          {...props}
          {...field}
          name={`${props.name}[0].url`}
          value={field?.value && field.value[0].url}
          isLoading={isLoading}
          handleButtonClick={handleButtonClick}
        />
      )}
    </>
  )
}
