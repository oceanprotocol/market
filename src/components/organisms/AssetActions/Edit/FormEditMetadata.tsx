import React, { ReactElement } from 'react'
import styles from './FormEditMetadata.module.css'
import { Field, Form, useFormikContext } from 'formik'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import { useOcean } from '@oceanprotocol/react'
import { FormFieldProps } from '../../../../@types/Form'

export default function FormEditMetadata({
  data,
  setShowEdit
}: {
  data: FormFieldProps[]
  setShowEdit: (show: boolean) => void
}): ReactElement {
  const { ocean, accountId } = useOcean()
  const { isValid } = useFormikContext()

  return (
    <Form className={styles.form}>
      {data.map((field: FormFieldProps) => (
        <Field key={field.name} {...field} component={Input} />
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
