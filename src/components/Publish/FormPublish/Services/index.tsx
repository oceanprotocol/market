import Input from '@shared/Form/Input'
import { Field } from 'formik'
import React, { ReactElement } from 'react'
import IconDownload from '@images/download.svg'
import IconCompute from '@images/compute.svg'
import content from '../../../../../content/publish/form.json'

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
      {content.services.fields.map(
        (field: FormFieldProps) =>
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
      )}
    </>
  )
}
