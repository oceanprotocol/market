import Input from '@shared/FormInput'
import { Field, useFormikContext } from 'formik'
import React, { ReactElement, useEffect } from 'react'
import content from '../../../../content/publish/form.json'
import consumerParametersContent from '../../../../content/publish/consumerParameters.json'
import { getFieldContent } from '@utils/form'
import { FormPublishData } from '../_types'

export default function ServicesFields(): ReactElement {
  // connect with Form state, use for conditional field rendering
  const { values, setFieldValue } = useFormikContext<FormPublishData>()

  // Auto-change access type based on algo privacy boolean.
  // Could be also done later in transformPublishFormToDdo().
  useEffect(() => {
    if (
      values.services[0].algorithmPrivacy === null ||
      values.services[0].algorithmPrivacy === undefined
    )
      return

    setFieldValue('services[0].access', 'access')
  }, [values.services[0].algorithmPrivacy, setFieldValue])

  return (
    <>
      <Field
        {...getFieldContent('dataTokenOptions', content.services.fields)}
        component={Input}
        name="services[0].dataTokenOptions"
      />
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
      <Field
        {...getFieldContent('usesConsumerParameters', content.services.fields)}
        component={Input}
        name="services[0].usesConsumerParameters"
      />
      {values.services[0].usesConsumerParameters && (
        <Field
          {...getFieldContent(
            'consumerParameters',
            consumerParametersContent.consumerParameters.fields
          )}
          component={Input}
          name="services[0].consumerParameters"
        />
      )}
    </>
  )
}
