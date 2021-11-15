import Input from '@shared/Form/Input'
import { Field, useFormikContext } from 'formik'
import React, { ReactElement } from 'react'
import content from '../../../../content/publish/form.json'
import { FormPublishData } from '../_types'
import { getFieldContent } from '../_utils'

const assetTypeOptionsTitles = getFieldContent(
  'type',
  content.metadata.fields
).options

const dockerImageOptionsTitles = getFieldContent(
  'dockerImage',
  content.metadata.fields
).options

const dockerImageOptions = dockerImageOptionsTitles.map((title) => ({
  name: title.toLowerCase(),
  title
}))

export default function MetadataFields(): ReactElement {
  // connect with Form state, use for conditional field rendering
  const { values } = useFormikContext<FormPublishData>()

  // BoxSelection component is not a Formik component
  // so we need to handle checked state manually.
  const assetTypeOptions = [
    {
      name: assetTypeOptionsTitles[0].toLowerCase(),
      title: assetTypeOptionsTitles[0],
      checked: values.metadata.type === assetTypeOptionsTitles[0].toLowerCase()
    },
    {
      name: assetTypeOptionsTitles[1].toLowerCase(),
      title: assetTypeOptionsTitles[1],
      checked: values.metadata.type === assetTypeOptionsTitles[1].toLowerCase()
    }
  ]

  return (
    <>
      <Field
        {...getFieldContent('nft', content.metadata.fields)}
        component={Input}
        name="metadata.nft"
      />
      <Field
        {...getFieldContent('type', content.metadata.fields)}
        component={Input}
        name="metadata.type"
        options={assetTypeOptions}
      />
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

      {values.metadata.type === 'algorithm' && (
        <>
          <Field
            {...getFieldContent('dockerImage', content.metadata.fields)}
            component={Input}
            name="metadata.dockerImage"
            options={dockerImageOptions}
          />
          {values.metadata.dockerImage === 'custom' && (
            <>
              <Field
                {...getFieldContent(
                  'dockerImageCustom',
                  content.metadata.fields
                )}
                component={Input}
                name="metadata.dockerImageCustom"
              />
              <Field
                {...getFieldContent(
                  'dockerImageCustomTag',
                  content.metadata.fields
                )}
                component={Input}
                name="metadata.dockerImageCustomTag"
              />
              <Field
                {...getFieldContent(
                  'dockerImageCustomEntrypoint',
                  content.metadata.fields
                )}
                component={Input}
                name="metadata.dockerImageCustomEntrypoint"
              />
            </>
          )}
        </>
      )}

      <Field
        {...getFieldContent('termsAndConditions', content.metadata.fields)}
        component={Input}
        name="metadata.termsAndConditions"
      />
    </>
  )
}
