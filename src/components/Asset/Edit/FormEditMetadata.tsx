import React, { ReactElement, useEffect } from 'react'
import { Field, Form, useFormikContext } from 'formik'
import Input, { InputProps } from '@shared/FormInput'
import FormActions from './FormActions'
import { useAsset } from '@context/Asset'
import { FormPublishData } from 'src/components/Publish/_types'
import { getFileUrlInfo } from '@utils/provider'

export function checkIfTimeoutInPredefinedValues(
  timeout: string,
  timeoutOptions: string[]
): boolean {
  if (timeoutOptions.indexOf(timeout) > -1) {
    return true
  }
  return false
}

export default function FormEditMetadata({
  data,
  showPrice,
  isComputeDataset
}: {
  data: InputProps[]
  showPrice: boolean
  isComputeDataset: boolean
}): ReactElement {
  const { oceanConfig, asset } = useAsset()
  const { values, setFieldValue } = useFormikContext<FormPublishData>()

  // This component is handled by Formik so it's not rendered like a "normal" react component,
  // so handleTimeoutCustomOption is called only once.
  // https://github.com/oceanprotocol/market/pull/324#discussion_r561132310
  // if (data && values) handleTimeoutCustomOption(data, values)

  const timeoutOptionsArray = data.filter(
    (field) => field.name === 'timeout'
  )[0].options as string[]

  if (isComputeDataset && timeoutOptionsArray.includes('Forever')) {
    const foreverOptionIndex = timeoutOptionsArray.indexOf('Forever')
    timeoutOptionsArray.splice(foreverOptionIndex, 1)
  } else if (!isComputeDataset && !timeoutOptionsArray.includes('Forever')) {
    timeoutOptionsArray.push('Forever')
  }

  useEffect(() => {
    // let's initiate files with empty url (we can't access the asset url) with type hidden (for UI frontend)
    setFieldValue('files', [
      {
        url: '',
        type: 'hidden'
      }
    ])

    const providerUrl = values?.services
      ? values?.services[0].providerUrl.url
      : asset.services[0].serviceEndpoint
    // if we have a sample file, we need to get the files' info before setting defaults links value
    asset?.metadata?.links?.[0] &&
      getFileUrlInfo(asset.metadata.links[0], providerUrl).then(
        (checkedFile) => {
          // set valid false if url is using google drive
          if (asset.metadata.links[0].includes('drive.google')) {
            setFieldValue('links', [
              {
                url: asset.metadata.links[0],
                valid: false
              }
            ])
            return
          }
          // initiate link with values from asset metadata
          setFieldValue('links', [
            {
              url: asset.metadata.links[0],
              ...checkedFile[0]
            }
          ])
        }
      )
  }, [])

  return (
    <Form>
      {data.map(
        (field: InputProps) =>
          (!showPrice && field.name === 'price') || (
            <Field
              key={field.name}
              options={
                field.name === 'timeout' && isComputeDataset === true
                  ? timeoutOptionsArray
                  : field.options
              }
              {...field}
              component={Input}
              prefix={field.name === 'price' && oceanConfig?.oceanTokenSymbol}
            />
          )
      )}

      <FormActions />
    </Form>
  )
}
