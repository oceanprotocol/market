import { BoxSelectionOption } from '@shared/FormInput/InputElement/BoxSelection'
import Input from '@shared/FormInput'
import { Field, useField, useFormikContext } from 'formik'
import React, { ReactElement, useEffect } from 'react'
import content from '../../../../content/publish/form.json'
import { FormPublishData } from '../_types'
import IconDataset from '@images/dataset.svg'
import IconAlgorithm from '@images/algorithm.svg'
import styles from './index.module.css'
import { algorithmContainerPresets } from '../_constants'
import Alert from '@shared/atoms/Alert'
import { useMarketMetadata } from '@context/MarketMetadata'
import { getFieldContent } from '@utils/form'

const assetTypeOptionsTitles = getFieldContent(
  'type',
  content.metadata.fields
).options

export default function MetadataFields(): ReactElement {
  const { siteContent } = useMarketMetadata()

  // connect with Form state, use for conditional field rendering
  const { values, setFieldValue } = useFormikContext<FormPublishData>()

  const [field, meta] = useField('metadata.dockerImageCustomChecksum')

  // BoxSelection component is not a Formik component
  // so we need to handle checked state manually.
  const assetTypeOptions: BoxSelectionOption[] = [
    {
      name: assetTypeOptionsTitles[0].toLowerCase(),
      title: assetTypeOptionsTitles[0],
      checked: values.metadata.type === assetTypeOptionsTitles[0].toLowerCase(),
      icon: <IconDataset />
    },
    {
      name: assetTypeOptionsTitles[1].toLowerCase(),
      title: assetTypeOptionsTitles[1],
      checked: values.metadata.type === assetTypeOptionsTitles[1].toLowerCase(),
      icon: <IconAlgorithm />
    }
  ]

  // Populate the Docker image field with our presets in _constants,
  // transformPublishFormToDdo will do the rest.
  const dockerImageOptions: BoxSelectionOption[] =
    algorithmContainerPresets.map((preset) => ({
      name: `${preset.image}:${preset.tag}`,
      title: `${preset.image}:${preset.tag}`,
      checked: values.metadata.dockerImage === `${preset.image}:${preset.tag}`
    }))

  useEffect(() => {
    setFieldValue(
      'services[0].access',
      values.metadata.type === 'algorithm' ? 'compute' : 'access'
    )
    setFieldValue(
      'services[0].algorithmPrivacy',
      values.metadata.type === 'algorithm'
    )
  }, [values.metadata.type])

  dockerImageOptions.push({ name: 'custom', title: 'Custom', checked: false })

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
        rows={7}
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
                  'dockerImageChecksum',
                  content.metadata.fields
                )}
                component={Input}
                name="metadata.dockerImageCustomChecksum"
                disabled={
                  values.metadata.dockerImageCustomChecksum && !meta.touched
                }
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
      <a
        className={styles.termsLink}
        href="/terms"
        rel="noopener noreferrer"
        target="_blank"
      >
        View Terms and Conditions
      </a>
    </>
  )
}
