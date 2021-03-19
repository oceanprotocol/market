import React, { ChangeEvent, ReactElement, useEffect } from 'react'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import { useOcean } from '../../../../providers/Ocean'
import { useWeb3 } from '../../../../providers/Web3'
import { FormFieldProps } from '../../../../@types/Form'
import {
  ServiceComputePrivacy,
  publisherTrustedAlgorithm as PublisherTrustedAlgorithm
} from '@oceanprotocol/lib'
import { AssetSelectionAsset } from '../../../molecules/FormFields/AssetSelection'
import slugify from 'slugify'
import stylesIndex from './index.module.css'
import styles from './FormEditMetadata.module.css'

export default function FormEditComputeDataset({
  data,
  title,
  setShowEdit,
  algorithmList
}: {
  data: FormFieldProps[]
  title: string
  setShowEdit: (show: boolean) => void
  algorithmList: AssetSelectionAsset[]
}): ReactElement {
  const { accountId } = useWeb3()
  const { ocean } = useOcean()
  const {
    isValid,
    validateField,
    setFieldValue,
    values
  }: FormikContextType<ServiceComputePrivacy> = useFormikContext()

  function addTrustedAlgorithm(did: string) {
    const selectedAlgorithm: PublisherTrustedAlgorithm = {
      did: did,
      containerSectionChecksum: undefined,
      filesChecksum: undefined
    }
    return [...values.publisherTrustedAlgorithms, selectedAlgorithm]
  }

  function removeTrustedAlgorithm(did: string) {
    const newValues = values.publisherTrustedAlgorithms.filter(
      (algorithm: any) => {
        return algorithm.did !== did
      }
    )
    return newValues
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
    algorithmList?.forEach((algorithm: AssetSelectionAsset) => {
      const checkbox = document.getElementById(
        slugify(algorithm.did)
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
      <h3 className={stylesIndex.title}>{title}</h3>
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
