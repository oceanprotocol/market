import React, { ChangeEvent, ReactElement } from 'react'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import { useOcean } from '../../../../providers/Ocean'
import Input from '../../../atoms/Input'
import { FormFieldProps } from '../../../../@types/Form'
import { MetadataPublishFormDataset } from '../../../../@types/MetaData'
import { checkIfTimeoutInPredefinedValues } from '../../../../utils/metadata'
import FormActions from './FormActions'
import styles from './FormEditMetadata.module.css'

function handleTimeoutCustomOption(
  data: FormFieldProps[],
  values: Partial<MetadataPublishFormDataset>
) {
  console.log('DATA: ', data)
  console.log('VALUES: ', values)
  const timeoutFieldContent = data.filter(
    (field) => field.name === 'timeout'
  )[0]
  const timeoutInputIndex = data.findIndex(
    (element) => element.name === 'timeout'
  )
  if (
    data[timeoutInputIndex].options.length < 6 &&
    !checkIfTimeoutInPredefinedValues(
      values.timeout,
      timeoutFieldContent.options
    )
  ) {
    data[timeoutInputIndex].options.push(values.timeout)
  } else if (
    data[timeoutInputIndex].options.length === 6 &&
    checkIfTimeoutInPredefinedValues(
      values.timeout,
      timeoutFieldContent.options
    )
  ) {
    data[timeoutInputIndex].options.pop()
  } else if (
    data[timeoutInputIndex].options.length === 6 &&
    data[timeoutInputIndex].options[5] !== values.timeout
  ) {
    data[timeoutInputIndex].options[5] = values.timeout
  }
}

const computeDatasetTimeout = ['1 day', '1 week', '1 month', '1 year']

export default function FormEditMetadata({
  data,
  setShowEdit,
  setTimeoutStringValue,
  values,
  showPrice,
  isComputeDataset
}: {
  data: FormFieldProps[]
  setShowEdit: (show: boolean) => void
  setTimeoutStringValue: (value: string) => void
  values: Partial<MetadataPublishFormDataset>
  showPrice: boolean
  isComputeDataset: boolean
}): ReactElement {
  const { config } = useOcean()
  const {
    validateField,
    setFieldValue
  }: FormikContextType<Partial<MetadataPublishFormDataset>> = useFormikContext()
  console.log('DATA: ', data)
  // Manually handle change events instead of using `handleChange` from Formik.
  // Workaround for default `validateOnChange` not kicking in
  function handleFieldChange(
    e: ChangeEvent<HTMLInputElement>,
    field: FormFieldProps
  ) {
    validateField(field.name)
    setFieldValue(field.name, e.target.value)
  }

  // This component is handled by Formik so it's not rendered like a "normal" react component,
  // so handleTimeoutCustomOption is called only once.
  // https://github.com/oceanprotocol/market/pull/324#discussion_r561132310
  if (data && values) handleTimeoutCustomOption(data, values)

  return (
    <Form className={styles.form}>
      {data.map(
        (field: FormFieldProps) =>
          (!showPrice && field.name === 'price') || (
            <Field
              key={field.name}
              {...field}
              options={
                field.name === 'timeout' && isComputeDataset
                  ? computeDatasetTimeout
                  : field.options
              }
              component={Input}
              prefix={field.name === 'price' && config.oceanTokenSymbol}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleFieldChange(e, field)
              }
            />
          )
      )}

      <FormActions
        setShowEdit={setShowEdit}
        handleClick={() => setTimeoutStringValue(values.timeout)}
      />
    </Form>
  )
}
