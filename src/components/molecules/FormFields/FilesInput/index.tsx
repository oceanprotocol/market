import React, { ReactElement, useState } from 'react'
import Button from '../../../atoms/Button'
import { useField } from 'formik'
import { toast } from 'react-toastify'
import FileInfo from './Info'
import FileInput from './Input'
import { getFileInfo } from '../../../../utils'
import { InputProps } from '../../../atoms/Input'

interface Values {
  url: string
}

export default function FilesInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props)
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState([{}])

  async function handleButtonClick(
    e: React.SyntheticEvent,
    url: string,
    i: number
  ) {
    // File example 'https://oceanprotocol.com/tech-whitepaper.pdf'
    e.preventDefault()

    try {
      setIsLoading(true)
      const newFileInfo = await getFileInfo(url)
      files[i] = newFileInfo
      newFileInfo && addItem(files)
    } catch (error) {
      toast.error('Could not fetch file info. Please check url and try again')
      console.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  function addItem(_files: Array<string>) {
    setFiles([..._files, {}])
    helpers.setValue(_files)
  }

  function removeItem(i: number) {
    const newFiles = [...files]
    newFiles.splice(i, 1)
    setFiles(newFiles)
    helpers.setValue(newFiles)
  }

  console.log('files', files)

  return (
    <>
      {files.map((file: string, i: number) =>
        file.contentLength ? (
          <FileInfo
            key={i}
            file={file}
            removeItem={(e: React.SyntheticEvent) => removeItem(i)}
          />
        ) : (
          <FileInput
            {...props}
            {...field}
            key={i}
            value={file.url || this}
            isLoading={isLoading}
            handleButtonClick={(e: React.SyntheticEvent, value: string) =>
              handleButtonClick(e, value, i)
            }
          />
        )
      )}
    </>
  )
}
