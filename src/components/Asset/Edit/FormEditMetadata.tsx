import React, { ReactElement, useEffect } from 'react'
import { Field, Form, useFormikContext } from 'formik'
import Input from '@shared/FormInput'
import FormActions from './FormActions'
import { useAsset } from '@context/Asset'
import { FormPublishData } from '@components/Publish/_types'
import { getFileInfo } from '@utils/provider'
import { getFieldContent } from '@utils/form'
import { isGoogleUrl } from '@utils/url'

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
  data: FormFieldContent[]
  showPrice: boolean
  isComputeDataset: boolean
}): ReactElement {
  const { asset } = useAsset()
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
    setTimeout(() => {
      setFieldValue('files', [
        {
          url: '',
          type: 'hidden'
        }
      ])
    }, 500)

    const providerUrl = values?.services
      ? values?.services[0].providerUrl.url
      : asset.services[0].serviceEndpoint

    // if we have a sample file, we need to get the files' info before setting defaults links value
    asset?.metadata?.links?.[0] &&
      getFileInfo(asset.metadata.links[0], providerUrl, 'url').then(
        (checkedFile) => {
          // set valid false if url is using google drive
          if (isGoogleUrl(asset.metadata.links[0])) {
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
              type: 'url',
              ...checkedFile[0]
            }
          ])
        }
      )
  }, [])

  return (
    <Form>
      <Field {...getFieldContent('name', data)} component={Input} name="name" />

      <Field
        {...getFieldContent('description', data)}
        component={Input}
        name="description"
      />

      {showPrice && (
        <Field
          {...getFieldContent('price', data)}
          component={Input}
          name="price"
        />
      )}

      <Field
        {...getFieldContent('files', data)}
        component={Input}
        name="files"
      />

      <Field
        {...getFieldContent('links', data)}
        component={Input}
        name="links"
      />

      <Field
        {...getFieldContent('timeout', data)}
        component={Input}
        name="timeout"
      />

      <Field
        {...getFieldContent('author', data)}
        component={Input}
        name="author"
      />

      <Field {...getFieldContent('tags', data)} component={Input} name="tags" />
      <Field
        {...getFieldContent('paymentCollector', data)}
        component={Input}
        name="paymentCollector"
      />
      <Field
        {...getFieldContent('assetState', data)}
        component={Input}
        name="assetState"
      />

      <FormActions />
    </Form>
  )
}
