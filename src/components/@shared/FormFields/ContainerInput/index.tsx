import React, { ReactElement, useState } from 'react'
import { useField, useFormikContext } from 'formik'
import UrlInput from '../URLInput'
import { InputProps } from '@shared/FormInput'
import { FormPublishData } from 'src/components/Publish/_types'
import { LoggerInstance } from '@oceanprotocol/lib'
import { toast } from 'react-toastify'
import axios from 'axios'
import isUrl from 'is-url-superb'
import ImageInfo from './Info'
import { getContainerChecksum } from '@utils/docker'

export default function ContainerInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const { values, setFieldError, setFieldValue } =
    useFormikContext<FormPublishData>()

  async function handleValidation(e: React.SyntheticEvent, container: string) {
    e.preventDefault()
    try {
      console.log('isUrl(container)', isUrl(container))
      setIsLoading(true)
      if (!isUrl(container, { lenient: false })) {
        const parsedContainerValue = container.split(':')
        const image = parsedContainerValue[0]
        const tag = parsedContainerValue[1]
        const checksum = await getContainerChecksum(image, tag)
        setFieldValue('metadata.dockerImageCustom', image)
        setFieldValue('metadata.dockerImageCustomTag', tag)
        if (checksum) {
          setFieldValue('metadata.dockerImageCustomChecksum', checksum)
          setIsValid(true)
        }
      }
    } catch (error) {
      setFieldError(`${field.name}[0].url`, error.message)
      LoggerInstance.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleClose() {
    setFieldValue('metadata.dockerImageCustom', '')
    setFieldValue('metadata.dockerImageCustomTag', '')
    setFieldValue('metadata.dockerImageCustomChecksum', '')
    setIsValid(false)
    helpers.setTouched(false)
  }

  return (
    <>
      {isValid ? (
        <ImageInfo
          image={values.metadata.dockerImageCustom}
          tag={values.metadata.dockerImageCustomTag}
          handleClose={handleClose}
        />
      ) : (
        <UrlInput
          submitText="Use"
          {...props}
          name={`${field.name}[0].url`}
          checkUrl={false}
          isLoading={isLoading}
          handleButtonClick={handleValidation}
        />
      )}
    </>
  )
}
