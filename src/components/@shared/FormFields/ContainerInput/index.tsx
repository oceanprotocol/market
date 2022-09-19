import React, { ReactElement, useState } from 'react'
import { useField, useFormikContext } from 'formik'
import UrlInput from '../URLInput'
import { InputProps } from '@shared/FormInput'
import { FormPublishData } from 'src/components/Publish/_types'
import { LoggerInstance } from '@oceanprotocol/lib'
import { toast } from 'react-toastify'
import axios from 'axios'
import isUrl from 'is-url-superb'

export default function FilesInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const { values, setFieldError } = useFormikContext<FormPublishData>()

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
        const checksum = await getContainerChecksum(
          parsedContainerValue[0],
          parsedContainerValue[1]
        )
        values.metadata.dockerImageCustom = parsedContainerValue[0]
        values.metadata.dockerImageCustomTag = parsedContainerValue[1]
        if (checksum) {
          values.metadata.dockerImageCustomChecksum = checksum
        }
      } else {
        console.log('open input modal')
      }
    } catch (error) {
      setFieldError(`${field.name}[0].url`, error.message)
      LoggerInstance.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleClose() {
    helpers.setValue(meta.initialValue)
    helpers.setTouched(false)
  }

  return (
    <>
      <UrlInput
        submitText="Check"
        {...props}
        name={`${field.name}[0].url`}
        checkUrl={false}
        isLoading={isLoading}
        handleButtonClick={handleValidation}
      />

      {/* {field?.value?.[0]?.valid === true ? (
        <FileInfo file={field.value[0]} handleClose={handleClose} />
      ) : (
       
      )} */}
    </>
  )
}
