import React, { ChangeEvent, ReactElement } from 'react'
import styles from './FormEditMetadata.module.css' // TODO
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import { FormFieldProps } from '../../../../@types/Form'
import { useOcean } from '../../../../providers/Ocean'
import { useWeb3 } from '../../../../providers/Web3'
import { AdvanceSettingsForm } from '../../../../models/FormEditCredential'

export default function FormAdvanceSettings({
  data,
  setShowEdit
}: {
  data: FormFieldProps[]
  setShowEdit: (show: boolean) => void
}): ReactElement {
  const { accountId } = useWeb3()
  const { ocean, config } = useOcean()
  const {
    isValid,
    validateField,
    setFieldValue
  }: FormikContextType<Partial<AdvanceSettingsForm>> = useFormikContext()

  function handleFieldChange(
    e: ChangeEvent<HTMLInputElement>,
    field: FormFieldProps
  ) {
    validateField(field.name)
    setFieldValue(field.name, e.target.value)
  }

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
