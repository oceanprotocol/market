import React, { ReactElement, useState } from 'react'
import { useField, useFormikContext } from 'formik'
import UrlInput from '../URLInput'
import { InputProps } from '@shared/FormInput'
import { FormPublishData } from '@components/Publish/_types'
import { LoggerInstance } from '@oceanprotocol/lib'
import ImageInfo from './Info'
import { getContainerChecksum } from '@utils/docker'

export default function ContainerInput(props: InputProps): ReactElement {
  const [field] = useField(props.name)
  const [fieldChecksum, metaChecksum, helpersChecksum] = useField(
    'metadata.dockerImageCustomChecksum'
  )

  const { values, setFieldError, setFieldValue } =
    useFormikContext<FormPublishData>()
  const [isLoading, setIsLoading] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [checked, setChecked] = useState(false)

  async function handleValidation(e: React.SyntheticEvent, container: string) {
    e.preventDefault()
    try {
      setIsLoading(true)
      const parsedContainerValue = container?.split(':')
      const imageName =
        parsedContainerValue?.length > 1
          ? parsedContainerValue?.slice(0, -1).join(':')
          : parsedContainerValue[0]
      const tag =
        parsedContainerValue?.length > 1 ? parsedContainerValue?.at(-1) : ''
      const containerInfo = await getContainerChecksum(imageName, tag)
      setFieldValue('metadata.dockerImageCustom', imageName)
      setFieldValue('metadata.dockerImageCustomTag', tag)
      setChecked(true)
      if (containerInfo.checksum) {
        setFieldValue(
          'metadata.dockerImageCustomChecksum',
          containerInfo.checksum
        )
        helpersChecksum.setTouched(false)
        setIsValid(true)
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
    setChecked(false)
    setIsValid(false)
    helpersChecksum.setTouched(true)
  }

  return (
    <>
      {checked ? (
        <ImageInfo
          image={values.metadata.dockerImageCustom}
          tag={values.metadata.dockerImageCustomTag}
          valid={isValid}
          handleClose={handleClose}
        />
      ) : (
        <UrlInput
          submitText="Use"
          {...props}
          name={`${field.name}[0].url`}
          checkUrl={false}
          isLoading={isLoading}
          storageType={'url'}
          handleButtonClick={handleValidation}
        />
      )}
    </>
  )
}
