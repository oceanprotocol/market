import React, { ReactElement, useEffect, FormEvent, ChangeEvent } from 'react'
import styles from './FormPublish.module.css'
import { useFormikContext, Field, Form, FormikContextType } from 'formik'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import { FormContent, FormFieldProps } from '../../../@types/Form'
import { MetadataPublishForm } from '../../../@types/MetaData'
import { useOcean } from '../../../providers/Ocean'

export default function FormPublish({
  content
}: {
  content: FormContent
}): ReactElement {
  const { ocean, account } = useOcean()
  const {
    status,
    setStatus,
    isValid,
    setErrors,
    setTouched,
    resetForm,
    initialValues,
    validateField,
    setFieldValue
  }: FormikContextType<MetadataPublishForm> = useFormikContext()

  // reset form validation on every mount
  useEffect(() => {
    setErrors({})
    setTouched({})

    // setSubmitting(false)
  }, [setErrors, setTouched])

  // Manually handle change events instead of using `handleChange` from Formik.
  // Workaround for default `validateOnChange` not kicking in
  function handleFieldChange(
    e: ChangeEvent<HTMLInputElement>,
    field: FormFieldProps
  ) {
    const value =
      field.type === 'terms' ? !JSON.parse(e.target.value) : e.target.value

    validateField(field.name)
    setFieldValue(field.name, value)
  }

  const resetFormAndClearStorage = (e: FormEvent<Element>) => {
    e.preventDefault()
    resetForm({ values: initialValues, status: 'empty' })
    setStatus('empty')
  }

  return (
    <Form
      className={styles.form}
      // do we need this?
      onChange={() => status === 'empty' && setStatus(null)}
    >
      {content.data.map((field: FormFieldProps) => (
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
          type="submit"
          disabled={!ocean || !account || !isValid || status === 'empty'}
        >
          Submit
        </Button>

        {status !== 'empty' && (
          <Button style="text" size="small" onClick={resetFormAndClearStorage}>
            Reset Form
          </Button>
        )}
      </footer>
    </Form>
  )
}
