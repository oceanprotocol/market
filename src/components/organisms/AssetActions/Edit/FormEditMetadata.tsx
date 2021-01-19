import React, { ChangeEvent, ReactElement } from 'react'
import styles from './FormEditMetadata.module.css'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import { useOcean } from '@oceanprotocol/react'
import { FormFieldProps } from '../../../../@types/Form'
import { MetadataPublishForm } from '../../../../@types/MetaData'
import { checkIfTimeoutInPredefinedValues } from '../../../../utils/metadata'
import { initialValues } from '../../../../models/FormTrade'

export default function FormEditMetadata({
  data,
  setShowEdit,
  values
}: {
  data: FormFieldProps[]
  setShowEdit: (show: boolean) => void
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

  function handleTimeoutCustomOption() {
    const timeoutInputIndex = data.findIndex(
      (element) => element.name === 'timeout'
    )
    if (
      data[timeoutInputIndex].options.length < 6 &&
      !checkIfTimeoutInPredefinedValues(values.timeout)
    ) {
      data[timeoutInputIndex].options.push(values.timeout)
    } else if (
      data[timeoutInputIndex].options.length === 6 &&
      checkIfTimeoutInPredefinedValues(values.timeout)
    ) {
      data[timeoutInputIndex].options.pop()
    } else if (
      data[timeoutInputIndex].options.length === 6 &&
      data[timeoutInputIndex].options[5] !== values.timeout
    ) {
      data[timeoutInputIndex].options[5] = values.timeout
    }
  }

  handleTimeoutCustomOption()

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
        <Button style="primary" disabled={!ocean || !accountId || !isValid}>
          Submit
        </Button>
        <Button style="text" onClick={() => setShowEdit(false)}>
          Cancel
        </Button>
      </footer>
    </Form>
  )
}
