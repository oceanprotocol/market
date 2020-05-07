import React, { useState } from 'react'
import { ArrayFieldTemplateProps } from 'react-jsonschema-form'
import { File } from '@oceanprotocol/squid'
import { toast } from 'react-toastify'
import useStoredValue from '../../../../hooks/useStoredValue'
import { getFileInfo } from '../../../../utils'
import FileInfo from './Info'
import FileInput from './Input'
import styles from './index.module.css'

const FILES_DATA_LOCAL_STORAGE_KEY = 'filesData'

const FileField = ({ items, formData }: ArrayFieldTemplateProps) => {
  const [isLoading, setIsLoading] = useState(false)
  // in order to access fileInfo as an array of objects upon formSubmit we need to keep it in localStorage
  const [fileInfo, setFileInfo] = useStoredValue<File[]>(
    FILES_DATA_LOCAL_STORAGE_KEY,
    []
  )

  const handleButtonClick = async (e: React.SyntheticEvent, url: string) => {
    // File example 'https://oceanprotocol.com/tech-whitepaper.pdf'
    e.preventDefault()

    try {
      setIsLoading(true)
      const newFileInfo = await getFileInfo(url)
      newFileInfo && setFileInfo([newFileInfo])
    } catch (error) {
      toast.error('Could not fetch file info. Please check url and try again')
      console.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = () => {
    setFileInfo([])
  }

  return (
    <>
      {items.map(({ children, key }, i) => (
        <div key={key} className={styles.arrayField}>
          {fileInfo[i] ? (
            <FileInfo info={fileInfo[i]} removeItem={removeItem} />
          ) : (
            <FileInput
              formData={formData}
              handleButtonClick={handleButtonClick}
              i={i}
              isLoading={isLoading}
            >
              {children}
            </FileInput>
          )}
        </div>
      ))}
    </>
  )
}

export default FileField
