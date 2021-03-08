import React, { ChangeEvent, ReactElement, useEffect } from 'react'
import styles from './FormEditMetadata.module.css'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import { useOcean } from '@oceanprotocol/react'
import { FormFieldProps } from '../../../../@types/Form'
import { ServiceComputePrivacy } from '@oceanprotocol/lib'

interface AlgorithmOption {
  did: string
  name: string
}

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
    e: ChangeEvent<HTMLSelectElement>,
    field: FormFieldProps
  ) {
    if (field.type === 'select') {
      let selectedValues = Array.from(
        e.target.selectedOptions,
        (option: HTMLOptionElement) => option.value
      )
      selectedValues = selectedValues.filter(
        (value: string) => value.length > 0
      )
      console.log('selectedValues', selectedValues)
      setFieldValue(field.name, selectedValues)
      validateField(field.name)
      return
    }
    const value =
      field.type === 'checkbox' ? !JSON.parse(e.target.value) : e.target.value
    setFieldValue(field.name, value)
  }

  useEffect(() => {
    const select = document.getElementsByTagName('select')[0]
    select.setAttribute('multiple', 'true')
    select.setAttribute('size', '4')

    algorithmList &&
      algorithmList.forEach((algorithm: AlgorithmOption) => {
        const option = document.createElement('option')
        option.text = algorithm.name
        option.value = algorithm.did
        if (values.publisherTrustedAlgorithms) {
          values.publisherTrustedAlgorithms.forEach((publishedAlgorithm) => {
            if (algorithm.did === publishedAlgorithm.did) {
              option.selected = true
            }
          })
        }

        select.add(option)
      })
  }, [algorithmList])

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
