import React, {
  ReactElement,
  useEffect,
  FormEvent,
  ChangeEvent,
  useState
} from 'react'
import { useFormikContext, Field, Form, FormikContextType } from 'formik'
import Input from '@shared/Form/Input'
import Download from '@images/download.svg'
import Compute from '@images/compute.svg'
import FormTitle from './FormTitle'
import FormActions from './FormActions'
import AdvancedSettings from '@shared/Form/FormFields/AdvancedSettings'
import { FormPublishData } from './_types'
import styles from './FormPublish.module.css'
import { initialValues } from './_constants'
import content from '../../../content/pages/publish/form-dataset.json'

export default function FormPublish(): ReactElement {
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
  }: FormikContextType<FormPublishData> = useFormikContext()

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
  // function handleFieldChange(
  //   e: ChangeEvent<HTMLInputElement>,
  //   field: FormFieldProps
  // ) {
  //   const value =
  //     field.type === 'terms' ? !JSON.parse(e.target.value) : e.target.value

  //   if (field.name === 'access' && value === 'Compute') {
  //     setComputeTypeSelected(true)
  //     if (values.timeout === 'Forever')
  //       setFieldValue('timeout', computeTypeOptions[0])
  //   } else {
  //     if (field.name === 'access' && value === 'Download') {
  //       setComputeTypeSelected(false)
  //     }
  //   }

  //   validateField(field.name)
  //   setFieldValue(field.name, value)
  // }

  const resetFormAndClearStorage = (e: FormEvent<Element>) => {
    e.preventDefault()
    resetForm({
      values: initialValues as FormPublishData,
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
                field.type === 'boxSelection'
                  ? accessTypeOptions
                  : field.name === 'timeout' && computeTypeSelected === true
                  ? computeTypeOptions
                  : field.options
              }
              component={Input}
              // onChange={(e: ChangeEvent<HTMLInputElement>) =>
              //   handleFieldChange(e, field)
              // }
            />
          )
      )}

      <FormActions
        isValid={isValid}
        resetFormAndClearStorage={resetFormAndClearStorage}
      />
    </Form>
  )
}
