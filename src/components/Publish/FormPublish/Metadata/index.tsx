import Input from '@shared/Form/Input'
import { Field, useFormikContext } from 'formik'
import React, { ReactElement } from 'react'
import content from '../../../../../content/publish/form.json'
import { FormPublishData } from '../../_types'
import { getFieldContent } from '../../_utils'

export default function MetadataFields(): ReactElement {
  // connect with Form state, use for conditional field rendering
  const { values } = useFormikContext<FormPublishData>()

  return (
    <>
      <Field
        {...getFieldContent('name', content.metadata.fields)}
        component={Input}
        name="metadata.name"
      />
      <Field
        {...getFieldContent('description', content.metadata.fields)}
        component={Input}
        name="metadata.description"
      />
      <Field
        {...getFieldContent('author', content.metadata.fields)}
        component={Input}
        name="metadata.author"
      />
      <Field
        {...getFieldContent('tags', content.metadata.fields)}
        component={Input}
        name="metadata.tags"
      />

      <div>
        <strong>Fancy NFT display</strong>
        <p>
          Place to show that metadata becomes part of a NFT. Plan is to
          autogenerate some graphic, display it here, and pass that graphic to
          the publish methods.
        </p>
      </div>

      <Field
        {...getFieldContent('termsAndConditions', content.metadata.fields)}
        component={Input}
        name="metadata.termsAndConditions"
      />

      {/* {content.metadata.fields.map((field: FormFieldContent) => (
        <Field
          {...field}
          key={`metadata-${field.name}`}
          component={Input}
          name={`metadata.${field.name}`}
        />
      ))} */}
    </>
  )
}
