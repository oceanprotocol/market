import React, {
  ReactElement,
  useEffect,
  FormEvent,
  ChangeEvent,
  useState
} from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { useFormikContext, Field, Form, FormikContextType } from 'formik'
import Input from '../../atoms/Input'
import { FormContent, FormFieldProps } from '../../../@types/Form'
import { MetadataPublishFormDataset } from '../../../@types/MetaData'
import { initialValues as initialValuesDataset } from '../../../models/FormAlgoPublish'
import { ReactComponent as Download } from '../../../images/download.svg'
import { ReactComponent as Compute } from '../../../images/compute.svg'
import FormTitle from './FormTitle'
import FormActions from './FormActions'
import styles from './FormPublish.module.css'
import AdvancedSettings from '../../molecules/FormFields/AdvancedSettings'

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
              advanced
              disclaimer
              disclaimerValues
            }
            warning
          }
        }
      }
    }
  }
`

export default function FormPublish({
  tutorial
}: {
  tutorial?: boolean
}): ReactElement {
  const data = useStaticQuery(query)
  const content: FormContent = data.content.edges[0].node.childPublishJson

  const {
    status,
    setStatus,
    isValid,
    values,
    setErrors,
    setTouched,
    resetForm,
    validateField,
    setFieldValue
  }: FormikContextType<MetadataPublishFormDataset> = useFormikContext()

  const [computeTypeSelected, setComputeTypeSelected] = useState<boolean>(false)

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

      {content.data.map(
        (field: FormFieldProps) =>
          field.advanced !== true && (
            <Field
              key={field.name}
              {...field}
              options={
                field.type === 'boxSelection' && tutorial
                  ? accessTypeOptions.filter((e) => e.name === 'Compute')
                  : field.type === 'boxSelection'
                  ? accessTypeOptions
                  : field.options
              }
              component={Input}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleFieldChange(e, field)
              }
            />
          )
      )}
      <AdvancedSettings
        content={content}
        handleFieldChange={handleFieldChange}
      />

      <FormActions
        isValid={isValid}
        resetFormAndClearStorage={resetFormAndClearStorage}
      />
    </Form>
  )
}
