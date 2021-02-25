import React, { ReactElement, useEffect, FormEvent, ChangeEvent } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import styles from './FormPublish.module.css'
import { useOcean } from '@oceanprotocol/react'
import { useFormikContext, Field, Form, FormikContextType } from 'formik'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import { FormContent, FormFieldProps } from '../../../@types/Form'
import { MetadataPublishFormAlgorithm } from '../../../@types/MetaData'
import { initialValues as initialValuesAlgorithm } from '../../../models/FormAlgoPublish'

import stylesIndex from './index.module.css'

const query = graphql`
  query {
    content: allFile(
      filter: { relativePath: { eq: "pages/publish/form-algorithm.json" } }
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
  const content: FormContent = data.content.edges[0].node.childPublishJson
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
  }: FormikContextType<MetadataPublishFormAlgorithm> = useFormikContext()

  // reset form validation on every mount
  useEffect(() => {
    setErrors({})
    setTouched({})

    // setSubmitting(false)
  }, [setErrors, setTouched])

  function setDisableFlag(flag: boolean) {
    content.data.forEach((field) => {
      if (field.disabled !== null) field.disabled = flag
    })
  }

  function handleImageSelectChange(imageSelected: string) {
    switch (imageSelected) {
      case 'node:pre-defined': {
        setFieldValue('dockerImage', imageSelected)
        setDisableFlag(true)
        setFieldValue('image', 'node')
        setFieldValue('containerTag', '10')
        setFieldValue('entrypoint', 'node $ALGO')
        break
      }
      case 'python:pre-defined': {
        setFieldValue('dockerImage', imageSelected)
        setDisableFlag(true)
        setFieldValue('image', 'oceanprotocol/algo_dockers')
        setFieldValue('containerTag', 'python-panda')
        setFieldValue('entrypoint', 'python $ALGO')
        break
      }
      default: {
        setFieldValue('dockerImage', imageSelected)
        setDisableFlag(false)
        setFieldValue('image', '')
        setFieldValue('containerTag', '')
        setFieldValue('entrypoint', '')
        break
      }
    }
  }

  // Manually handle change events instead of using `handleChange` from Formik.
  // Workaround for default `validateOnChange` not kicking in
  function handleFieldChange(
    e: ChangeEvent<HTMLInputElement>,
    field: FormFieldProps
  ) {
    const value =
      field.type === 'checkbox' ? !JSON.parse(e.target.value) : e.target.value
    if (field.name === 'dockerImage') {
      validateField(field.name)
      handleImageSelectChange(e.target.value)
    } else {
      validateField(field.name)
      setFieldValue(field.name, value)
    }
  }

  const resetFormAndClearStorage = (e: FormEvent<Element>) => {
    e.preventDefault()
    resetForm({
      values: initialValuesAlgorithm as MetadataPublishFormAlgorithm,
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
      <h2 className={stylesIndex.formTitle}>{content.title}</h2>
      {content.data.map((field: FormFieldProps) => (
        <Field
          key={field.name}
          {...field}
          disabled={field.disabled}
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
