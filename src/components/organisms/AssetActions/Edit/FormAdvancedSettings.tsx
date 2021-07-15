import React, { ChangeEvent, ReactElement } from 'react'
import styles from './FormEditMetadata.module.css'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import { FormFieldProps } from '../../../../@types/Form'
import { useOcean } from '../../../../providers/Ocean'
import { useWeb3 } from '../../../../providers/Web3'
import { AdvancedSettingsForm } from '../../../../models/FormEditCredential'
import { useAsset } from '../../../../providers/Asset'

export default function FormAdvancedSettings({
  data,
  setShowEdit
}: {
  data: FormFieldProps[]
  setShowEdit: (show: boolean) => void
}): ReactElement {
  const { accountId } = useWeb3()
  const { isAssetNetwork } = useAsset()
  const { ocean, config } = useOcean()
  const {
    isValid,
    validateField,
    setFieldValue
  }: FormikContextType<Partial<AdvancedSettingsForm>> = useFormikContext()

  function handleFieldChange(
    e: ChangeEvent<HTMLInputElement>,
    field: FormFieldProps
  ) {
    validateField(field.name)
    if (e.target.type === 'checkbox')
      setFieldValue(field.name, e.target.checked)
    else setFieldValue(field.name, e.target.value)
  }

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
        <Button
          style="primary"
          disabled={!ocean || !accountId || !isValid || !isAssetNetwork}
        >
          Submit
        </Button>
        <Button style="text" onClick={() => setShowEdit(false)}>
          Cancel
        </Button>
      </footer>
    </Form>
  )
}
