import Input from '@shared/FormInput'
import { Field, useFormikContext } from 'formik'
import React, { ReactElement, useEffect } from 'react'
import IconDownload from '@images/download.svg'
import IconCompute from '@images/compute.svg'
import content from '../../../../content/publish/form.json'
import { getFieldContent } from '../_utils'
import { FormPublishData } from '../_types'
import { getOceanConfig } from '@utils/ocean'
import { computeEnvironmentDefaults } from '../_constants'

const accessTypeOptionsTitles = getFieldContent(
  'access',
  content.services.fields
).options

export default function ServicesFields(): ReactElement {
  // connect with Form state, use for conditional field rendering
  const { values, setFieldValue, touched, setTouched } =
    useFormikContext<FormPublishData>()

  // name and title should be download, but option value should be access, probably the best way would be to change the component so that option is an object like {name,value}
  const accessTypeOptions = [
    {
      name: 'download',
      value: accessTypeOptionsTitles[0].toLowerCase(),
      title: 'Download',
      icon: <IconDownload />,
      // BoxSelection component is not a Formik component
      // so we need to handle checked state manually.
      checked:
        values.services[0].access === accessTypeOptionsTitles[0].toLowerCase()
    },
    {
      name: accessTypeOptionsTitles[1].toLowerCase(),
      value: accessTypeOptionsTitles[1].toLowerCase(),
      title: accessTypeOptionsTitles[1],
      icon: <IconCompute />,
      checked:
        values.services[0].access === accessTypeOptionsTitles[1].toLowerCase()
    }
  ]

  const computeEnvironmentOptions = [
    `Default: ${computeEnvironmentDefaults.cpu} CPU, ${
      computeEnvironmentDefaults.gpu > 0
        ? `${computeEnvironmentDefaults.gpu} ${computeEnvironmentDefaults.gpuType} GPU, `
        : ''
    } ${computeEnvironmentDefaults.memory} memory, ${
      computeEnvironmentDefaults.volumeSize
    } disk`
  ]

  // Auto-change access type based on algo privacy boolean.
  // Could be also done later in transformPublishFormToDdo().
  useEffect(() => {
    if (!values.services[0].algorithmPrivacy) return

    setFieldValue(
      'services[0].access',
      values.services[0].algorithmPrivacy === true ? 'compute' : 'access'
    )
  }, [values.services[0].algorithmPrivacy, setFieldValue])

  // Auto-change default providerUrl on user network change
  useEffect(() => {
    if (!values?.user?.chainId) return

    const config = getOceanConfig(values.user.chainId)
    config && setFieldValue('services[0].providerUrl.url', config.providerUri)
    setTouched({ ...touched, services: [{ providerUrl: { url: true } }] })
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
      {values.services[0].access === 'compute' && (
        <Field
          {...getFieldContent('computeOptions', content.services.fields)}
          component={Input}
          name="services[0].computeOptions"
          options={computeEnvironmentOptions}
          disabled
          checked
        />
      )}
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
