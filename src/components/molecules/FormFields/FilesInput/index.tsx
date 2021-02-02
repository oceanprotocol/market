import React, { ReactElement, useState } from 'react'
import axios from 'axios'
import { useField } from 'formik'
import { toast } from 'react-toastify'
import FileInfo from './Info'
import FileInput from './Input'
import { useOcean } from '@oceanprotocol/react'
import { InputProps } from '../../../atoms/Input'
import { fileinfo } from '../../../../utils/provider'

export default function FilesInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const { config } = useOcean()
  const source = axios.CancelToken.source()

  async function handleButtonClick(e: React.SyntheticEvent, url: string) {
    // hack so the onBlur-triggered validation does not show,
    // like when this field is required
    helpers.setTouched(false)

    // File example 'https://oceanprotocol.com/tech-whitepaper.pdf'
    e.preventDefault()

    try {
      setIsLoading(true)
      const checkedFile = await fileinfo(url, config.providerUri, source.token)
      checkedFile && helpers.setValue([checkedFile])
    } catch (error) {
      toast.error('Could not fetch file info. Please check URL and try again')
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
