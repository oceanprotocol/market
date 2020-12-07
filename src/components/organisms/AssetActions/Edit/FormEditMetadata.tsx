import React, { ReactElement } from 'react'
import styles from './FormEditMetadata.module.css'
import { Field, Form, FieldInputProps } from 'formik'
import { MetadataPublishForm } from '../../../../@types/MetaData'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import { useOcean } from '@oceanprotocol/react'

export default function FormEditMetadata({
  values,
  setShowEdit
}: {
  values: Partial<MetadataPublishForm>
  setShowEdit: (show: boolean) => void
}): ReactElement {
  const { ocean, accountId } = useOcean()

  return (
    <Form className={styles.form}>
      <Field name="name">
        {({
          field,
          form
        }: {
          field: FieldInputProps<Partial<MetadataPublishForm>>
          form: any
        }) => (
          <Input
            name={field.name}
            label="New Title"
            value={values.name}
            help="Enter a concise title."
            field={field}
            form={form}
            required
          />
        )}
      </Field>

      <Field name="description">
        {({
          field,
          form
        }: {
          field: FieldInputProps<Partial<MetadataPublishForm>>
          form: any
        }) => (
          <Input
            name={field.name}
            label="New Description"
            value={values.description}
            help="Add a thorough description with as much detail as possible. You can use [Markdown](https://daringfireball.net/projects/markdown/basics)."
            type="textarea"
            rows={10}
            field={field}
            form={form}
            required
          />
        )}
      </Field>

      <footer className={styles.actions}>
        <Button style="primary" disabled={!ocean || !accountId}>
          Submit
        </Button>
        <Button style="text" onClick={() => setShowEdit(false)}>
          Cancel
        </Button>
      </footer>
    </Form>
  )
}
