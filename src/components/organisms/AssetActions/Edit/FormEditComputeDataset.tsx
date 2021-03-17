import React, { ChangeEvent, ReactElement, useEffect } from 'react'
import styles from './FormEditMetadata.module.css'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import { useOcean } from '../../../../providers/Ocean'
import { useWeb3 } from '../../../../providers/Web3'
import { FormFieldProps } from '../../../../@types/Form'
import { ServiceComputePrivacy } from '@oceanprotocol/lib'
import { AssetSelectionAsset } from '../../../molecules/FormFields/AssetSelection'
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
  algorithmList: AssetSelectionAsset[]
}): ReactElement {
  const { accountId } = useWeb3()
  const { ocean } = useOcean()
  const {
    isValid,
    validateField,
    setFieldValue
  }: FormikContextType<ServiceComputePrivacy> = useFormikContext()

  function addTrustedAlgorithm(did: string) {
    values.publisherTrustedAlgorithms.push({
      did: did,
      containerSectionChecksum: undefined,
      filesChecksum: undefined
    })
    return values.publisherTrustedAlgorithms
  }

  function removeTrustedAlgorithm(did: string) {
    values.publisherTrustedAlgorithms = values.publisherTrustedAlgorithms.filter(
      (algorithm: any) => {
        return algorithm.did !== did
      }
    )
    return values.publisherTrustedAlgorithms
  }

  // Manually handle change events instead of using `handleChange` from Formik.
  // Workaround for default `validateOnChange` not kicking in
  function handleFieldChange(
    e: ChangeEvent<HTMLInputElement>,
    field: FormFieldProps
  ) {
    let value: any
    switch (field.type) {
      case 'assetSelectionMultiple':
        value = e.target.checked
          ? addTrustedAlgorithm(e.target.value)
          : removeTrustedAlgorithm(e.target.value)
        break
      case 'checkbox':
        value = !JSON.parse(e.target.value)
        break
      default:
        value = JSON.parse(e.target.value)
    }
    setFieldValue(field.name, value)
    validateField(field.name)
  }

  useEffect(() => {
    algorithmList &&
      algorithmList.forEach((algorithm: AssetSelectionAsset) => {
        const checkbox = document.getElementById(
          slugify(algorithm.name)
        ) as HTMLInputElement
        if (values.publisherTrustedAlgorithms) {
          values.publisherTrustedAlgorithms.forEach((publishedAlgorithm) => {
            if (algorithm.did === publishedAlgorithm.did) {
              checkbox.checked = true
            }
          })
        }
      })
  }, [data])

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
