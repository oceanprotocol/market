import React, { ReactElement, useState } from 'react'
import { useField, FormikProps } from 'formik'
import { File } from '@oceanprotocol/squid'
import { toast } from 'react-toastify'
import FileInfo from './Info'
import FileInput from './Input'
import { getFileInfo } from '../../../utils'

interface Values {
  url: string
}

export default function FilesInput(
  props: FormikProps<Values | File>
): ReactElement {
  const [field, meta, helpers] = useField(props as any)
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
