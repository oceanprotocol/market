import { Field } from 'formik'
import React, { ReactElement, useState } from 'react'
import { getFieldContent } from '../../../@utils/form'
import content from '../../../../content/publish/form.json'
import Input from '../../@shared/FormInput'

export default function CustomizationFields(): ReactElement {
  const [showAlgorigthmConsumerParams, setShowAlgorigthmConsumerParams] =
    useState(false)

  return (
    <>
      <Field
        {...getFieldContent('consumerParameters', content.customization.fields)}
        component={Input}
        name="metadata.consumerParameters"
      />

      <Field
        {...getFieldContent('userdata', content.customization.fields)}
        component={Input}
        name="services[0].files[0].userdata"
      />
    </>
  )
}
