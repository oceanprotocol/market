import React, { ReactElement } from 'react'
import styles from './PublishForm.module.css'
import { useOcean, usePublish } from '@oceanprotocol/react'
import { useFormikContext, Form, Field } from 'formik'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import { FormContent, FormFieldProps } from '../../../@types/Form'
import { Persist } from 'formik-persist'
import Loader from '../../atoms/Loader'

export default function PublishForm({
  content
}: {
  content: FormContent
}): ReactElement {
  const { ocean, account } = useOcean()
  const { publishStepText, isLoading } = usePublish()
  const { status, setStatus, isValid } = useFormikContext()

  return (
    <Form
      className={styles.form}
      onChange={() => status === 'empty' && setStatus(null)}
    >
      {content.data.map((field: FormFieldProps) => (
        <Field key={field.name} {...field} component={Input} />
      ))}

      {isLoading ? (
        <Loader message={publishStepText} />
      ) : (
        <Button
          style="primary"
          type="submit"
          disabled={!ocean || !account || !isValid || status === 'empty'}
        >
          Submit
        </Button>
      )}
      <Persist name="ocean-publish-form" />
    </Form>
  )
}
