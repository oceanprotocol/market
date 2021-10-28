import Input from '@shared/Form/Input'
import { Field, useFormikContext } from 'formik'
import React, { ReactElement } from 'react'
import IconDownload from '@images/download.svg'
import IconCompute from '@images/compute.svg'
import content from '../../../../../content/publish/form.json'
import { getFieldContent } from '../../_utils'
import { FormPublishData } from '../../_types'

const accessTypeOptionsTitles = getFieldContent(
  'access',
  content.services.fields
).options

const accessTypeOptions = [
  {
    name: accessTypeOptionsTitles[0].toLowerCase(),
    title: accessTypeOptionsTitles[0],
    icon: <IconDownload />
  },
  {
    name: accessTypeOptionsTitles[1].toLowerCase(),
    title: accessTypeOptionsTitles[1],
    icon: <IconCompute />
  }
]

const assetTypeOptionsTitles = getFieldContent(
  'type',
  content.services.fields
).options

const assetTypeOptions = [
  {
    name: assetTypeOptionsTitles[0].toLowerCase(),
    title: assetTypeOptionsTitles[0]
  },
  {
    name: assetTypeOptionsTitles[1].toLowerCase(),
    title: assetTypeOptionsTitles[1]
  }
]

export default function ServicesFields(): ReactElement {
  // connect with Form state, use for conditional field rendering
  const { values } = useFormikContext<FormPublishData>()

  return (
    <>
      <Field
        {...getFieldContent('type', content.services.fields)}
        component={Input}
        name="type"
        options={assetTypeOptions}
      />
      <Field
        {...getFieldContent('dataTokenOptions', content.services.fields)}
        component={Input}
        name="services[0].dataTokenOptions"
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
        {...getFieldContent('access', content.services.fields)}
        component={Input}
        name="services[0].access"
        options={accessTypeOptions}
      />
      <Field
        {...getFieldContent('timeout', content.services.fields)}
        component={Input}
        name="services[0].timeout"
      />
      <Field
        {...getFieldContent('providerUri', content.services.fields)}
        component={Input}
        name="services[0].providerUri"
      />

      {/* {content.services.fields.map(
        (field: FormFieldContent) =>
          field.advanced !== true && (
            <Field
              {...field}
              key={`services-${field.name}`}
              component={Input}
              name={`services[0].${field.name}`}
              options={
                field.name === 'access' ? accessTypeOptions : field.options
              }
            />
          )
      )} */}
    </>
  )
}
