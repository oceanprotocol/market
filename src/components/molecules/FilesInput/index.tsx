import React, { ReactElement, useState } from 'react'
import { useField } from 'formik'
import { toast } from 'react-toastify'
import FileInfo from './Info'
import FileInput from './Input'
import getFileInfo from '../../../utils/file'
import { InputProps } from '../../atoms/Input'

interface Values {
  url: string
}

export default function FilesInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props)
  const [isLoading, setIsLoading] = useState(false)

  async function handleButtonClick(e: React.SyntheticEvent, url: string) {
    // File example 'https://oceanprotocol.com/tech-whitepaper.pdf'
    e.preventDefault()

    try {
      setIsLoading(true)
      const newFileInfo = await getFileInfo(url)
      newFileInfo && helpers.setValue([newFileInfo])
    } catch (error) {
      toast.error('Could not fetch file info. Please check url and try again')
      console.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  function removeItem() {
    helpers.setValue(undefined)
  }

  return (
    <>
      {typeof field.value === 'object' ? (
        <FileInfo file={field.value[0]} removeItem={removeItem} />
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
