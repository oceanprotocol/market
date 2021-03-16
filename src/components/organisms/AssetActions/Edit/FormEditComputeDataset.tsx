import React, { ChangeEvent, ReactElement, useEffect } from 'react'
import styles from './FormEditMetadata.module.css'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import { useOcean } from '@oceanprotocol/react'
import { FormFieldProps } from '../../../../@types/Form'
import { ServiceComputePrivacy } from '@oceanprotocol/lib'
import { AlgorithmOption } from '../../../../@types/ComputeDataset'
import slugify from 'slugify'

export default function FormEditComputeDataset({
  data,
  setShowEdit,
  values,
  algorithmList
}: {
  data: FormFieldProps[]
  setShowEdit: (show: boolean) => void
  values: ServiceComputePrivacy
  algorithmList: AlgorithmOption[]
}): ReactElement {
  const { ocean, accountId } = useOcean()
  const {
    isValid,
    validateField,
    setFieldValue
  }: FormikContextType<ServiceComputePrivacy> = useFormikContext()

  // Manually handle change events instead of using `handleChange` from Formik.
  // Workaround for default `validateOnChange` not kicking in
  function handleFieldChange(
    e: ChangeEvent<HTMLInputElement>,
    field: FormFieldProps
  ) {
    let value: any
    switch (field.type) {
      case 'assetSelectionMultiple':
        // value = values.publisherTrustedAlgorithms.push(e.target.value)
        console.log(JSON.parse(e.target.value))
        console.log(values.publisherTrustedAlgorithms)
        break
      case 'checkbox':
        value = !JSON.parse(e.target.value)
        break
      default:
        value = JSON.parse(e.target.value)
    }
    console.log(value)
    setFieldValue(field.name, value)
    validateField(field.name)
  }

  useEffect(() => {
    algorithmList &&
      algorithmList.forEach((algorithm: AlgorithmOption) => {
        const checkbox = document.getElementById(slugify(algorithm.name))
        if (values.publisherTrustedAlgorithms) {
          values.publisherTrustedAlgorithms.forEach((publishedAlgorithm) => {
            if (algorithm.did === publishedAlgorithm.did) {
              checkbox.checked = true
            }
          })
        }
      })
  }, [data])

  console.log(document.getElementsByTagName('select')[0])

  return (
    <Form className={styles.form}>
      {data.map((field: FormFieldProps) => (
        <Field
          key={field.name}
          {...field}
          component={Input}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            handleFieldChange(e, field)
          }
        />
      ))}
      <footer className={styles.actions}>
        <Button style="primary" disabled={!ocean || !accountId || !isValid}>
          Submit
        </Button>
        <Button style="text" onClick={() => setShowEdit(false)}>
          Cancel
        </Button>
      </footer>
    </Form>
  )
}
