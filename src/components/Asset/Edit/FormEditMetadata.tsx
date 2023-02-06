import React, { ReactElement, useEffect } from 'react'
import { Field, Form, useFormikContext } from 'formik'
import Input from '@shared/FormInput'
import FormActions from './FormActions'
import { useAsset } from '@context/Asset'
import { FormPublishData } from '@components/Publish/_types'
import { getFileInfo } from '@utils/provider'
import { getFieldContent } from '@utils/form'
import { isGoogleUrl } from '@utils/url'
import styles from './FormEditMetadata.module.css'

export function checkIfTimeoutInPredefinedValues(
  timeout: string,
  timeoutOptions: string[]
): boolean {
  if (timeoutOptions.indexOf(timeout) > -1) {
    return true
  }
  return false
}

export interface FormEditMetadataValues {
  author: string
  description: string
  files: string
  links: string
  name: string
  price: string
  timeout: string
}

export default function FormEditMetadata({
  data,
  showPrice,
  isComputeDataset,
  initialValues,
  currentValues
}: {
  data: FormFieldContent[]
  showPrice: boolean
  isComputeDataset: boolean
  initialValues: FormEditMetadataValues
  currentValues: FormEditMetadataValues
}): ReactElement {
  const { asset } = useAsset()
  const { values, setFieldValue } = useFormikContext<FormPublishData>()

  // get diff between initial value and current value to get inputs changed
  // we'll add an outline when an input has changed
  const getDifference = (a: any, b: any) =>
    Object.entries(a).reduce(
      (ac: any, [k, v]) => (b[k] && b[k] !== v ? ((ac[k] = b[k]), ac) : ac),
      {}
    )

  const diff = getDifference(initialValues, currentValues)

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
      <span
        className={
          Object.keys(diff).includes(getFieldContent('name', data).name)
            ? styles.inputChanged
            : null
        }
      >
        <Field
          {...getFieldContent('name', data)}
          component={Input}
          name="name"
        />
      </span>

      <span
        className={
          Object.keys(diff).includes(getFieldContent('description', data).name)
            ? styles.inputChanged
            : null
        }
      >
        <Field
          {...getFieldContent('description', data)}
          component={Input}
          name="description"
        />
      </span>

      {showPrice && (
        <span
          className={
            Object.keys(diff).includes(getFieldContent('price', data).name)
              ? styles.inputChanged
              : null
          }
        >
          <Field
            {...getFieldContent('price', data)}
            component={Input}
            name="price"
          />
        </span>
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

      <span
        className={
          Object.keys(diff).includes(getFieldContent('timeout', data).name)
            ? styles.inputChanged
            : null
        }
      >
        <Field
          {...getFieldContent('timeout', data)}
          component={Input}
          name="timeout"
        />
      </span>

      <span
        className={
          Object.keys(diff).includes(getFieldContent('author', data).name)
            ? styles.inputChanged
            : null
        }
      >
        <Field
          {...getFieldContent('author', data)}
          component={Input}
          name="author"
        />
      </span>

      <Field {...getFieldContent('tags', data)} component={Input} name="tags" />
      <span
        className={
          Object.keys(diff).includes(
            getFieldContent('paymentCollector', data).name
          )
            ? styles.inputChanged
            : null
        }
      >
        <Field
          {...getFieldContent('paymentCollector', data)}
          component={Input}
          name="paymentCollector"
        />
      </span>

      <Field
        {...getFieldContent('assetState', data)}
        component={Input}
        name="assetState"
      />

      <FormActions />
    </Form>
  )
}
