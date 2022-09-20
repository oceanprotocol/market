import React, { ReactElement, useState } from 'react'
import { useField, useFormikContext } from 'formik'
import UrlInput from '../URLInput'
import { InputProps } from '@shared/FormInput'
import { FormPublishData } from 'src/components/Publish/_types'
import { LoggerInstance } from '@oceanprotocol/lib'
import ImageInfo from './Info'
import { getContainerChecksum } from '@utils/docker'

export default function ContainerInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [checked, setChecked] = useState(false)
  const { values, setFieldError, setFieldValue } =
    useFormikContext<FormPublishData>()

  async function handleValidation(e: React.SyntheticEvent, container: string) {
    e.preventDefault()
    try {
      setIsLoading(true)
      const parsedContainerValue = container?.split(':')
      const imageNname = parsedContainerValue?.slice(0, -1).join(':')
      const tag =
        parsedContainerValue.length > 1 ? parsedContainerValue?.at(-1) : ''
      setFieldValue('metadata.dockerImageCustom', imageNname)
      setFieldValue('metadata.dockerImageCustomTag', tag)
      const checksum = await getContainerChecksum(imageNname, tag)
      if (checksum) {
        setFieldValue('metadata.dockerImageCustomChecksum', checksum)
        setIsValid(true)
      }
      setChecked(true)
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
    helpers.setTouched(false)
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
          handleButtonClick={handleValidation}
        />
      )}
    </>
  )
}
