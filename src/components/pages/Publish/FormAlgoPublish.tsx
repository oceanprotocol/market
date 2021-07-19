import React, {
  ReactElement,
  useEffect,
  useState,
  FormEvent,
  ChangeEvent
} from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import styles from './FormPublish.module.css'
import { useOcean } from '../../../providers/Ocean'
import { useFormikContext, Field, Form, FormikContextType } from 'formik'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import { FormContent, FormFieldProps } from '../../../@types/Form'
import { MetadataPublishFormAlgorithm } from '../../../@types/MetaData'
import { initialValues as initialValuesAlgorithm } from '../../../models/FormAlgoPublish'
import stylesIndex from './index.module.css'
import AdvancedSettings from '../../molecules/FormFields/advancedSettings'

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
              sortOptions
              options
              advanced
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
  const [selectedDockerImage, setSelectedDockerImage] = useState<string>(
    initialValues.dockerImage
  )
  const [advancedSettings, setAdvancedSettings] = useState<boolean>(false)

  const dockerImageOptions = [
    {
      name: 'node:latest',
      title: 'node:latest',
      checked: true
    },
    {
      name: 'python:latest',
      title: 'python:latest',
      checked: false
    },
    {
      name: 'custom image',
      title: 'custom image',
      checked: false
    }
  ]

  // reset form validation on every mount
  useEffect(() => {
    setErrors({})
    setTouched({})
  }, [setErrors, setTouched])

  function handleImageSelectChange(imageSelected: string) {
    switch (imageSelected) {
      case 'node:latest': {
        setFieldValue('image', 'node')
        setFieldValue('containerTag', 'latest')
        setFieldValue('entrypoint', 'node $ALGO')
        break
      }
      case 'python:latest': {
        setFieldValue('image', 'oceanprotocol/algo_dockers')
        setFieldValue('containerTag', 'python-panda')
        setFieldValue('entrypoint', 'python $ALGO')
        break
      }
      default: {
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
      field.type === 'checkbox' || field.type === 'terms'
        ? !JSON.parse(e.target.value)
        : e.target.value
    if (field.name === 'dockerImage') {
      setSelectedDockerImage(e.target.value)
      handleImageSelectChange(e.target.value)
    }
    validateField(field.name)
    setFieldValue(field.name, value)
  }
  function toggleAdvancedSettings(e: FormEvent<Element>) {
    e.preventDefault()
    advancedSettings === true
      ? setAdvancedSettings(false)
      : setAdvancedSettings(true)
    console.log('advancedSettings', advancedSettings)
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
      {content.data.map(
        (field: FormFieldProps) =>
          ((field.name !== 'entrypoint' &&
            field.name !== 'image' &&
            field.name !== 'containerTag') ||
            selectedDockerImage === 'custom image') && (
            <Field
              key={field.name}
              {...field}
              options={
                field.type === 'boxSelection'
                  ? dockerImageOptions
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
