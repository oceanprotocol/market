import React, { ReactElement, useEffect, FormEvent, ChangeEvent } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import styles from './FormPublish.module.css'
import { useOcean } from '@oceanprotocol/react'
import { useFormikContext, Field, Form, FormikContextType } from 'formik'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import { FormContent, FormFieldProps } from '../../../@types/Form'
import { MetadataPublishFormDataset } from '../../../@types/MetaData'

const query = graphql`
  query {
    content: allFile(
      filter: { relativePath: { eq: "pages/form-dataset.json" } }
    ) {
      edges {
        node {
          childPagesJson {
            title
            data {
              name
              placeholder
              label
              help
              type
              required
              disabled
              sortOptions
              options
            }
            warning
          }
        }
      }
    }
  }
`

export default function FormPublish(): ReactElement {
  const data = useStaticQuery(query)
  const content: FormContent = data.content.edges[0].node.childPagesJson
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
  }: FormikContextType<MetadataPublishFormDataset> = useFormikContext()

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
    validateField(field.name)
    setFieldValue(field.name, e.target.value)
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
