import Input from '@shared/Form/Input'
import { Field } from 'formik'
import React, { ReactElement } from 'react'
import content from '../../../../../content/publish/form.json'

export default function MetadataFields(): ReactElement {
  return (
    <>
      {content.metadata.fields.map((field: FormFieldProps) => (
        <Field
          {...field}
          key={`metadata-${field.name}`}
          component={Input}
          name={`metadata.${field.name}`}
        />
      ))}
    </>
  )
}
