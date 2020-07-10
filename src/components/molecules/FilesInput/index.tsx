import React, { ReactElement, useState } from 'react'
import isUrl from 'is-url-superb'
import { useField, FormikProps } from 'formik'
import { File } from '@oceanprotocol/squid'
import { toast } from 'react-toastify'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import Loader from '../../atoms/Loader'
import styles from './index.module.css'
import FileInfo from './Info'
import FileInput from './Input'
import shortid from 'shortid'
import { getFileInfo } from '../../../utils'

interface Values {
  url: string
}

export default function FilesInput(props: FormikProps<File>): ReactElement {
  const [field, meta, helpers] = useField(props)
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File>()

  const handleButtonClick = async (e: React.SyntheticEvent, url: string) => {
    // File example 'https://oceanprotocol.com/tech-whitepaper.pdf'
    e.preventDefault()

    try {
      setIsLoading(true)
      const newFileInfo = await getFileInfo(url)
      newFileInfo && setFile(newFileInfo)
    } catch (error) {
      toast.error('Could not fetch file info. Please check url and try again')
      console.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  function removeItem() {
    setFile(undefined)
  }

  return (
    <>
      {file ? (
        <FileInfo file={file} removeItem={removeItem} />
      ) : (
        <FileInput
          {...props}
          {...field}
          handleButtonClick={handleButtonClick}
        />
      )}
    </>
  )
}
