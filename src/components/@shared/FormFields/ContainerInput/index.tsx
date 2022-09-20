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

export default function ContainerInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const { values, setFieldError, setFieldValue } =
    useFormikContext<FormPublishData>()

  async function getContainerChecksum(
    image: string,
    tag: string
  ): Promise<string> {
    try {
      const response = await axios.post(
        `https://dockerhub-proxy.oceanprotocol.com`,
        {
          image,
          tag
        }
      )
      if (
        !response ||
        response.status !== 200 ||
        response.data.status !== 'success'
      ) {
        toast.error(
          'Could not fetch docker hub image info. Please input the container checksum manually'
        )
        return null
      }
      return response.data.result.checksum
    } catch (error) {
      LoggerInstance.error(error.message)
      toast.error(
        'Could not fetch docker hub image info. Please input the container checksum manually'
      )
      return null
    }
  }

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
      } else {
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
