import React, { ReactElement, useEffect, useState } from 'react'
import { Field, useField } from 'formik'
import FileInfoDetails from './Info'
import UrlInput from '../URLInput'
import Input, { InputProps } from '@shared/FormInput'
import { getFileInfo, checkValidProvider } from '@utils/provider'
import { LoggerInstance, FileInfo } from '@oceanprotocol/lib'
import { useAsset } from '@context/Asset'
import styles from './index.module.css'
import { useWeb3 } from '@context/Web3'
import InputHeaders from '../Headers'
import Button from '@shared/atoms/Button'
import Loader from '@shared/atoms/Loader'
import { checkJson } from '@utils/codemirror'
import { isGoogleUrl } from '@utils/url/index'
import isUrl from 'is-url-superb'
import MethodInput from '../MethodInput'

export default function FilesInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const [disabledButton, setDisabledButton] = useState(true)
  const { asset } = useAsset()
  const { chainId } = useWeb3()

  const providerUrl = props.form?.values?.services
    ? props.form?.values?.services[0].providerUrl.url
    : asset.services[0].serviceEndpoint

  const storageType = field.value[0].type
  const query = field.value[0].query || undefined
  const abi = field.value[0].abi || undefined
  const headers = field.value[0].headers || undefined
  const method = field.value[0].method || undefined

  async function handleValidation(e: React.SyntheticEvent, url: string) {
    // File example 'https://oceanprotocol.com/tech-whitepaper.pdf'
    e?.preventDefault()

    try {
      setIsLoading(true)

      if (isUrl(url) && isGoogleUrl(url)) {
        throw Error(
          'Google Drive is not a supported hosting service. Please use an alternative.'
        )
      }

      // Check if provider is a valid provider
      const isValid = await checkValidProvider(providerUrl)
      if (!isValid)
        throw Error(
          '✗ Provider cannot be reached, please check status.oceanprotocol.com and try again later.'
        )

      const checkedFile = await getFileInfo(
        url,
        providerUrl,
        storageType,
        query,
        headers,
        abi,
        chainId,
        method
      )

      // error if something's not right from response
      if (!checkedFile)
        throw Error('Could not fetch file info. Is your network down?')

      if (checkedFile[0].valid === false)
        throw Error(
          `✗ No valid file detected. Check your ${props.label} and details, and try again.`
        )

      // if all good, add file to formik state
      helpers.setValue([
        {
          url,
          providerUrl,
          type: storageType,
          query,
          headers,
          abi,
          chainId,
          ...checkedFile[0]
        }
      ])
    } catch (error) {
      props.form.setFieldError(`${field.name}[0].url`, error.message)
      LoggerInstance.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleMethod(method: string) {
    helpers.setValue([{ ...props.value[0], method }])
  }

  function handleClose() {
    helpers.setTouched(false)
    helpers.setValue([
      { url: '', type: storageType === 'hidden' ? 'ipfs' : storageType }
    ])
  }

  useEffect(() => {
    storageType === 'graphql' && setDisabledButton(!providerUrl || !query)

    storageType === 'smartcontract' &&
      setDisabledButton(!providerUrl || !abi || !checkJson(abi))

    storageType === 'url' && setDisabledButton(!providerUrl)

    if (meta.error?.length > 0) {
      const { url } = meta.error[0] as unknown as FileInfo
      url && setDisabledButton(true)
    }
  }, [storageType, providerUrl, headers, query, abi, meta])

  return (
    <>
      {field?.value?.[0]?.valid === true ||
      field?.value?.[0]?.type === 'hidden' ? (
        <FileInfoDetails file={field.value[0]} handleClose={handleClose} />
      ) : (
        <>
          {props.methods && storageType === 'url' ? (
            <MethodInput
              {...props}
              name={`${field.name}[0].url`}
              isLoading={isLoading}
              checkUrl={true}
              handleButtonClick={handleMethod}
              storageType={storageType}
            />
          ) : (
            <UrlInput
              submitText="Validate"
              {...props}
              name={`${field.name}[0].url`}
              isLoading={isLoading}
              hideButton={
                storageType === 'graphql' || storageType === 'smartcontract'
              }
              checkUrl={true}
              handleButtonClick={handleValidation}
              storageType={storageType}
            />
          )}

          {props.innerFields && (
            <>
              <div className={`${styles.textblock}`}>
                {props.innerFields &&
                  props.innerFields.map((innerField: any, i: number) => {
                    return (
                      <>
                        <Field
                          key={i}
                          component={
                            innerField.type === 'headers' ? InputHeaders : Input
                          }
                          {...innerField}
                          name={`${field.name}[0].${innerField.value}`}
                          value={field.value[0][innerField.value]}
                        />
                      </>
                    )
                  })}
              </div>

              <Button
                style="primary"
                onClick={(e: React.SyntheticEvent) => {
                  e.preventDefault()
                  handleValidation(e, field.value[0].url)
                }}
                disabled={disabledButton}
              >
                {isLoading ? (
                  <Loader />
                ) : (
                  `submit ${
                    storageType === 'graphql'
                      ? 'query'
                      : storageType === 'smartcontract'
                      ? 'abi'
                      : 'url'
                  }`
                )}
              </Button>
            </>
          )}
        </>
      )}
    </>
  )
}
