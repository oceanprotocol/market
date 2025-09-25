import React, { ReactElement, useEffect, useState } from 'react'
import { Field, useField } from 'formik'
import FileInfoDetails from './Info'
import UrlInput from '../URLInput'
import Input, { InputProps } from '@shared/FormInput'
import { getFileInfo, checkValidProvider } from '@utils/provider'
import { LoggerInstance, FileInfo } from '@oceanprotocol/lib'
import { useAsset } from '@context/Asset'
import styles from './index.module.css'
import { useNetwork } from 'wagmi'
import InputKeyValue from '../KeyValueInput'
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
  const { chain } = useNetwork()
  const chainId = chain?.id

  // --- Fallback sólido para providerUrl ---
  const ENV_PROVIDER_URL =
    process.env.NEXT_PUBLIC_PROVIDER_URL_11155111 ||
    process.env.NEXT_PUBLIC_PROVIDER_URL ||
    'https://v4.provider.oceanprotocol.com'

  const providerUrlFromForm =
    props.form?.values?.services?.[0]?.providerUrl?.url
  const providerUrlFromAsset = asset?.services?.[0]?.serviceEndpoint

  // Usaremos SIEMPRE este providerUrl resuelto
  const providerUrl =
    providerUrlFromForm || providerUrlFromAsset || ENV_PROVIDER_URL

  // Ayuda visual en consola del navegador (puedes quitarlo si quieres)
  console.log('FilesInput providerUrl =>', providerUrl)

  const storageType = field.value[0].type
  const query = field.value[0].query || undefined
  const abi = field.value[0].abi || undefined
  const headers = field.value[0].headers || undefined
  const method = field.value[0].method || 'GET'

  async function handleValidation(e: React.SyntheticEvent, url: string) {
    e?.preventDefault()

    try {
      setIsLoading(true)

      // Validación rápida de URL
      if (!isUrl(url || '')) {
        throw Error('Please enter a valid http(s) URL.')
      }

      if (isGoogleUrl(url)) {
        throw Error(
          'Google Drive is not a supported hosting service. Please use an alternative.'
        )
      }

      // Comprueba que el provider es válido y responde JSON
      const isValid = await checkValidProvider(providerUrl)
      if (!isValid)
        throw Error(
          '✗ Provider cannot be reached, please check status.oceanprotocol.com and try again later.'
        )

      // Pide al provider la info del archivo
      const checkedFile = await getFileInfo(
        url,
        providerUrl,
        storageType,
        query,
        headers,
        abi,
        chain?.id,
        method
      )

      if (!checkedFile)
        throw Error('Could not fetch file info. Is your network down?')

      if (checkedFile[0].valid === false)
        throw Error(
          `✗ No valid file detected. Check your ${props.label} and details, and try again.`
        )

      // Todo ok: persistimos en el campo local de este input
      helpers.setValue([
        {
          url,
          providerUrl, // guardamos el que realmente usamos
          type: storageType,
          query,
          headers,
          abi,
          chainId,
          ...checkedFile[0]
        }
      ])

      // ⚠️ además: sincroniza con el formulario padre (wizard) para habilitar "Continue"
      props.form?.setFieldValue(
        'services[0].providerUrl.url',
        providerUrl,
        false
      )
      props.form?.setFieldValue(
        'services[0].files',
        [
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
        ],
        false
      )
      // marca como "touched" y limpia errores para que el wizard deje continuar
      props.form?.setFieldTouched('services[0].providerUrl.url', true, false)
      props.form?.setFieldTouched('services[0].files', true, false)
      props.form?.setFieldTouched(`${field.name}[0].url`, true, false)
      props.form?.setFieldError(`${field.name}[0].url`, undefined)
    } catch (error: any) {
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

  // Habilitamos el botón si:
  // - graphql: hay providerUrl y query
  // - smartcontract: hay providerUrl y abi válido
  // - url: hay providerUrl y la url empieza por http(s)
  useEffect(() => {
    if (storageType === 'graphql') {
      setDisabledButton(!(providerUrl && query))
      return
    }

    if (storageType === 'smartcontract') {
      setDisabledButton(!(providerUrl && abi && checkJson(abi)))
      return
    }

    if (storageType === 'url') {
      const ok =
        !!providerUrl &&
        isUrl((field.value?.[0]?.url || '').trim()) &&
        (field.value?.[0]?.url || '').trim().toLowerCase().startsWith('http')
      setDisabledButton(!ok)
      return
    }

    // Por defecto, no bloquear
    setDisabledButton(false)
  }, [storageType, providerUrl, headers, query, abi, meta, field.value])

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
                      <Field
                        key={i}
                        component={
                          innerField.type === 'headers' ? InputKeyValue : Input
                        }
                        {...innerField}
                        name={`${field.name}[0].${innerField.value}`}
                        value={field.value[0][innerField.value]}
                      />
                    )
                  })}
              </div>

              <Button
                style="primary"
                onClick={(e: React.SyntheticEvent) => {
                  e.preventDefault()
                  handleValidation(e, field.value[0].url)
                }}
                disabled={isLoading || disabledButton}
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
