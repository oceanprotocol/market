import React, { ReactElement, useEffect, FormEvent, ChangeEvent } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { useFormikContext, Field, Form, FormikContextType } from 'formik'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import { FormContent, FormFieldProps } from '../../../@types/Form'
import { MetadataPublishFormDataset } from '../../../@types/MetaData'
import { initialValues as initialValuesDataset } from '../../../models/FormAlgoPublish'
import { useOcean } from '../../../providers/Ocean'
import { ReactComponent as Download } from '../../../images/download.svg'
import { ReactComponent as Compute } from '../../../images/compute.svg'
import FormTitle from './FormTitle'
import styles from './FormPublish.module.css'
import { useWeb3 } from '../../../providers/Web3'

const query = graphql`
  query {
    content: allFile(
      filter: { relativePath: { eq: "pages/publish/form-dataset.json" } }
    ) {
      edges {
        node {
          childPublishJson {
            title
            data {
              name
              placeholder
              label
              help
              type
              required
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
  const content: FormContent = data.content.edges[0].node.childPublishJson

  const { ocean, account } = useOcean()
  const {
    status,
    setStatus,
    isValid,
    setErrors,
    setTouched,
    resetForm,
    validateField,
    setFieldValue
  }: FormikContextType<MetadataPublishFormDataset> = useFormikContext()

  // reset form validation on every mount
  useEffect(() => {
    setErrors({})
    setTouched({})

    // setSubmitting(false)
  }, [setErrors, setTouched])

  const accessTypeOptions = [
    {
      name: 'Download',
      title: 'Download',
      icon: <Download />
    },
    {
      name: 'Compute',
      title: 'Compute',
      icon: <Compute />
    }
  ]

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
    resetForm({
      values: initialValuesDataset as MetadataPublishFormDataset,
      status: 'empty'
    })
    setStatus('empty')
  }

  return (
    <Form
      className={styles.form}
      // do we need this?
      onChange={() => status === 'empty' && setStatus(null)}
    >
      <FormTitle title={content.title} />
      {content.data.map((field: FormFieldProps) => (
        <Field
          key={field.name}
          {...field}
          options={
            field.type === 'boxSelection' ? accessTypeOptions : field.options
          }
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
