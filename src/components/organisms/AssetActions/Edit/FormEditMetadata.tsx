import React, { ChangeEvent, ReactElement } from 'react'
import styles from './FormEditMetadata.module.css'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import { FormFieldProps } from '../../../../@types/Form'
import { MetadataPublishFormDataset } from '../../../../@types/MetaData'
import { checkIfTimeoutInPredefinedValues } from '../../../../utils/metadata'
import { useOcean } from '../../../../providers/Ocean'
import { useWeb3 } from '../../../../providers/Web3'

function handleTimeoutCustomOption(
  data: FormFieldProps[],
  values: Partial<MetadataPublishFormDataset>
) {
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

export default function FormEditMetadata({
  data,
  setShowEdit,
  setTimeoutStringValue,
  values
}: {
  data: FormFieldProps[]
  setShowEdit: (show: boolean) => void
  setTimeoutStringValue: (value: string) => void
  values: Partial<MetadataPublishFormDataset>
}): ReactElement {
  const { accountId } = useWeb3()
  const { ocean } = useOcean()
  const {
    isValid,
    validateField,
    setFieldValue
  }: FormikContextType<Partial<MetadataPublishFormDataset>> = useFormikContext()

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
      {data.map((field: FormFieldProps) => (
        <Field
          key={field.name}
          {...field}
          component={Input}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleFieldChange(e, field)
          }
        />
      ))}

      <footer className={styles.actions}>
        <Button
          style="primary"
          disabled={!ocean || !accountId || !isValid}
          onClick={() => setTimeoutStringValue(values.timeout)}
        >
          Submit
        </Button>
        <Button style="text" onClick={() => setShowEdit(false)}>
          Cancel
        </Button>
      </footer>
    </Form>
  )
}
