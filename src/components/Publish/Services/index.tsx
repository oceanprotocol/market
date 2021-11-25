import Input from '@shared/FormInput'
import { Field, useFormikContext } from 'formik'
import React, { ReactElement, useEffect } from 'react'
import IconDownload from '@images/download.svg'
import IconCompute from '@images/compute.svg'
import content from '../../../../content/publish/form.json'
import { getFieldContent } from '../_utils'
import { FormPublishData } from '../_types'
import { useWeb3 } from '@context/Web3'
import { getOceanConfig } from '@utils/ocean'

const accessTypeOptionsTitles = getFieldContent(
  'access',
  content.services.fields
).options

export default function ServicesFields(): ReactElement {
  // connect with Form state, use for conditional field rendering
  const { values, setFieldValue, setTouched } =
    useFormikContext<FormPublishData>()

  const accessTypeOptions = [
    {
      name: accessTypeOptionsTitles[0].toLowerCase(),
      title: accessTypeOptionsTitles[0],
      icon: <IconDownload />,
      // BoxSelection component is not a Formik component
      // so we need to handle checked state manually.
      checked:
        values.services[0].access === accessTypeOptionsTitles[0].toLowerCase()
    },
    {
      name: accessTypeOptionsTitles[1].toLowerCase(),
      title: accessTypeOptionsTitles[1],
      icon: <IconCompute />,
      checked:
        values.services[0].access === accessTypeOptionsTitles[1].toLowerCase()
    }
  ]

  // Auto-change access type based on algo privacy boolean.
  // Could be also done later in transformPublishFormToDdo().
  useEffect(() => {
    if (!values.services[0].algorithmPrivacy) return

    setFieldValue(
      'services[0].access',
      values.services[0].algorithmPrivacy === true ? 'compute' : 'download'
    )
  }, [values.services[0].algorithmPrivacy, setFieldValue])

  // Auto-change default providerUrl on user network change
  useEffect(() => {
    if (!values?.user?.chainId) return

    const config = getOceanConfig(values.user.chainId)
    config && setFieldValue('services[0].providerUrl.url', config.providerUri)
    setTouched({ services: [{ providerUrl: { url: true } }] })
  }, [values.user.chainId, setFieldValue, setTouched])

  return (
    <>
      <Field
        {...getFieldContent('dataTokenOptions', content.services.fields)}
        component={Input}
        name="services[0].dataTokenOptions"
      />
      {values.metadata.type === 'algorithm' ? (
        <Field
          {...getFieldContent('algorithmPrivacy', content.services.fields)}
          component={Input}
          name="services[0].algorithmPrivacy"
        />
      ) : (
        <Field
          {...getFieldContent('access', content.services.fields)}
          component={Input}
          name="services[0].access"
          options={accessTypeOptions}
        />
      )}
      <Field
        {...getFieldContent('providerUrl', content.services.fields)}
        component={Input}
        name="services[0].providerUrl"
      />
      <Field
        {...getFieldContent('files', content.services.fields)}
        component={Input}
        name="services[0].files"
      />
      <Field
        {...getFieldContent('links', content.services.fields)}
        component={Input}
        name="services[0].links"
      />
      <Field
        {...getFieldContent('timeout', content.services.fields)}
        component={Input}
        name="services[0].timeout"
      />
    </>
  )
}
