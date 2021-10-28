import Input from '@shared/Form/Input'
import { Field } from 'formik'
import React, { ReactElement } from 'react'
import IconDownload from '@images/download.svg'
import IconCompute from '@images/compute.svg'
import content from '../../../../../content/publish/form.json'
import { getFieldContent } from '../../_utils'

const accessTypeOptions = [
  {
    name: 'Download',
    title: 'Download',
    icon: <IconDownload />
  },
  {
    name: 'Compute',
    title: 'Compute',
    icon: <IconCompute />
  }
]

export default function ServicesFields(): ReactElement {
  return (
    <>
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
