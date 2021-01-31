import React, { ReactElement, useState } from 'react'
import { useField } from 'formik'
import { toast } from 'react-toastify'
import FileInfo from './Info'
import FileInput from './Input'
import { InputProps } from '../../../atoms/Input'
import { useOcean } from '@oceanprotocol/react'
import { File as FileMetadata } from '@oceanprotocol/lib'

export default function FilesInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const { ocean } = useOcean()

  async function checkFileUrl(url: string): Promise<FileMetadata> {
    const filesArray: FileMetadata[] = await ocean.provider.fileinfo(url)
    if (filesArray[0] && filesArray[0].valid) {
      filesArray[0].url = url
      return filesArray[0]
    }
    toast.error('Could not fetch file info. Please check URL and try again')
    return null
  }

  async function handleButtonClick(e: React.SyntheticEvent, url: string) {
    // hack so the onBlur-triggered validation does not show,
    // like when this field is required
    helpers.setTouched(false)

    // File example 'https://oceanprotocol.com/tech-whitepaper.pdf'
    e.preventDefault()

    try {
      setIsLoading(true)
      const fileInfo = await checkFileUrl(url)
      fileInfo && helpers.setValue([fileInfo])
    } catch (error) {
      toast.error(
        'Could not fetch file info. Please connect your Web3 wallet and try again'
      )
      console.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {field?.value && field.value[0] && typeof field.value === 'object' ? (
        <FileInfo name={props.name} file={field.value[0]} />
      ) : (
        <FileInput
          {...props}
          {...field}
          isLoading={isLoading}
          handleButtonClick={handleButtonClick}
        />
      )}
    </>
  )
}
