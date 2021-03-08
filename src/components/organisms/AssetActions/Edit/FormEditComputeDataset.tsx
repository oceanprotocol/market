import React, { ChangeEvent, ReactElement, useEffect } from 'react'
import styles from './FormEditMetadata.module.css'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import { useOcean } from '@oceanprotocol/react'
import { FormFieldProps } from '../../../../@types/Form'
import { ServiceComputePrivacy } from '@oceanprotocol/lib'
import { ComputePrivacy } from '../../../../@types/ComputePrivacy'

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
  values: ComputePrivacy
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
    console.log(field.name)
    console.log(e.target.value)
    if (field.type === 'select') {
      setFieldValue(field.name, e.target.value)
      validateField(field.name)
      return
    }
    const value =
      field.type === 'checkbox' ? !JSON.parse(e.target.value) : e.target.value
    setFieldValue(field.name, value)
  }

  useEffect(() => {
    const select = document.getElementsByTagName('select')[0]
    console.log(values)

    algorithmList &&
      algorithmList.forEach((algorithm: AlgorithmOption) => {
        const option = document.createElement('option')
        option.text = algorithm.name
        option.value = algorithm.did
        if (values.publisherTrustedAlgorithms) {
          if (algorithm.did === values.publisherTrustedAlgorithms) {
            option.selected = true
          }
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
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
