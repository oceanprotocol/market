import React, {
  ReactElement,
  useEffect,
  FormEvent,
  ChangeEvent,
  useState
} from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { useFormikContext, Field, Form, FormikContextType } from 'formik'
import Input from '@shared/Form/Input'
import { ReactComponent as Download } from '@images/download.svg'
import { ReactComponent as Compute } from '@images/compute.svg'
import FormActions from './FormActions'
import AdvancedSettings from '@shared/Form/FormFields/AdvancedSettings'
import { FormPublishData } from '../_types'
import styles from './index.module.css'
import { initialValues } from '../_constants'
import Tabs from '@shared/atoms/Tabs'
import Pricing from './Pricing'
import Debug from '../Debug'

const query = graphql`
  query {
    content: publishJson {
      metadata {
        title
        fields {
          name
          placeholder
          label
          help
          type
          required
          options
          disclaimer
          disclaimerValues
          advanced
        }
      }
      services {
        title
        fields {
          name
          placeholder
          label
          help
          type
          required
          options
          disclaimer
          disclaimerValues
          advanced
        }
      }
      pricing {
        title
        fields {
          name
          placeholder
          label
          help
          type
          required
          options
          disclaimer
          disclaimerValues
          advanced
        }
      }
      warning
    }
  }
`

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

export default function FormPublish(): ReactElement {
  const { content } = useStaticQuery(query)

  const {
    setStatus,
    isValid,
    values,
    setErrors,
    setTouched,
    resetForm,
    validateField,
    setFieldValue
  }: FormikContextType<FormPublishData> = useFormikContext()

  const [computeTypeSelected, setComputeTypeSelected] = useState<boolean>(false)

  // reset form validation on every mount
  useEffect(() => {
    setErrors({})
    setTouched({})

    // setSubmitting(false)
  }, [setErrors, setTouched])

  const computeTypeOptions = ['1 day', '1 week', '1 month', '1 year']

  // Manually handle change events instead of using `handleChange` from Formik.
  // Workaround for default `validateOnChange` not kicking in
  function handleFieldChange(
    e: ChangeEvent<HTMLInputElement>,
    field: FormFieldProps
  ) {
    const value =
      field.type === 'terms' ? !JSON.parse(e.target.value) : e.target.value

    if (field.name === 'access' && value === 'Compute') {
      setComputeTypeSelected(true)
      if (values.timeout === 'Forever')
        setFieldValue('timeout', computeTypeOptions[0])
    } else {
      if (field.name === 'access' && value === 'Download') {
        setComputeTypeSelected(false)
      }
    }

    validateField(field.name)
    setFieldValue(field.name, value)
  }

  const resetFormAndClearStorage = (e: FormEvent<Element>) => {
    e.preventDefault()
    resetForm({
      values: initialValues as FormPublishData,
      status: 'empty'
    })
    setStatus('empty')
  }

  function getStepContentFields(contentStep: FormStepContent) {
    return contentStep.fields.map(
      (field: FormFieldProps) =>
        field.advanced !== true && (
          <Field
            key={field.name}
            {...field}
            options={
              field.type === 'boxSelection'
                ? accessTypeOptions
                : field.name === 'timeout' && computeTypeSelected === true
                ? computeTypeOptions
                : field.options
            }
            component={Input}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleFieldChange(e, field)
            }
          />
        )
    )
  }

  const tabs = [
    {
      title: content.metadata.title,
      content: (
        <>
          {getStepContentFields(content.metadata)}
          <AdvancedSettings
            content={content.metadata}
            handleFieldChange={handleFieldChange}
          />
          <FormActions
            isValid={isValid}
            resetFormAndClearStorage={resetFormAndClearStorage}
          />
        </>
      )
    },
    {
      title: content.services.title,
      content: (
        <>
          {getStepContentFields(content.services)}
          <AdvancedSettings
            content={content.services}
            handleFieldChange={handleFieldChange}
          />
          <FormActions
            isValid={isValid}
            resetFormAndClearStorage={resetFormAndClearStorage}
          />
        </>
      )
    },
    {
      title: content.pricing.title,
      content: (
        <>
          <Pricing />
          <FormActions
            isValid={isValid}
            resetFormAndClearStorage={resetFormAndClearStorage}
          />
        </>
      )
    }
  ]

  return (
    <>
      <Form className={styles.form}>
        <Tabs items={tabs} />
      </Form>
      <Debug values={values} />
    </>
  )
}
