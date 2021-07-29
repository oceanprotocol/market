import React, { ChangeEvent, ReactElement } from 'react'
import styles from './FormEditMetadata.module.css'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Input from '../../../atoms/Input'
import { FormFieldProps } from '../../../../@types/Form'
import { AdvancedSettingsForm } from '../../../../models/FormEditCredential'
import FormActions from './FormActions'

export default function FormAdvancedSettings({
  data,
  setShowEdit
}: {
  data: FormFieldProps[]
  setShowEdit: (show: boolean) => void
}): ReactElement {
  const {
    validateField,
    setFieldValue
  }: FormikContextType<Partial<AdvancedSettingsForm>> = useFormikContext()

  function handleFieldChange(
    e: ChangeEvent<HTMLInputElement>,
    field: FormFieldProps
  ) {
    validateField(field.name)
    if (e.target.type === 'checkbox')
      setFieldValue(field.name, e.target.checked)
    else setFieldValue(field.name, e.target.value)
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

      <FormActions setShowEdit={setShowEdit} />
    </Form>
  )
}
