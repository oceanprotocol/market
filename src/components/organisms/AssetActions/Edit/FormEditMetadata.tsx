import React, { ChangeEvent, ReactElement } from 'react'
import styles from './FormEditMetadata.module.css'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import { useOcean } from '@oceanprotocol/react'
import { FormFieldProps } from '../../../../@types/Form'
import { MetadataPublishForm } from '../../../../@types/MetaData'
import { checkIfTimeoutInPredefinedValues } from '../../../../utils/metadata'

function handleTimeoutCustomOption(
  data: FormFieldProps[],
  values: Partial<MetadataPublishForm>
) {
  const timeoutOptions = data.map((field) => {
    if (field.name === 'timeout') return field.options
  })[0]
  const timeoutInputIndex = data.findIndex(
    (element) => element.name === 'timeout'
  )
  if (
    data[timeoutInputIndex].options.length < 6 &&
    !checkIfTimeoutInPredefinedValues(values.timeout, timeoutOptions)
  ) {
    data[timeoutInputIndex].options.push(values.timeout)
  } else if (
    data[timeoutInputIndex].options.length === 6 &&
    checkIfTimeoutInPredefinedValues(values.timeout, timeoutOptions)
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
  values: Partial<MetadataPublishForm>
}): ReactElement {
  const { ocean, accountId } = useOcean()
  const {
    isValid,
    validateField,
    setFieldValue
  }: FormikContextType<Partial<MetadataPublishForm>> = useFormikContext()

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
  handleTimeoutCustomOption(data, values)

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
