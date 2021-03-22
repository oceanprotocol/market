import React, { ReactElement, useEffect, useState } from 'react'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import { useOcean } from '../../../../providers/Ocean'
import { useWeb3 } from '../../../../providers/Web3'
import { FormFieldProps } from '../../../../@types/Form'
import { AssetSelectionAsset } from '../../../molecules/FormFields/AssetSelection'
import stylesIndex from './index.module.css'
import styles from './FormEditMetadata.module.css'
import { getAlgorithmsForAssetSelection } from '../../../../utils/aquarius'
import { useAsset } from '../../../../providers/Asset'
import { ComputePrivacyForm } from '../../../../models/FormEditComputeDataset'

export default function FormEditComputeDataset({
  data,
  title,
  setShowEdit
}: {
  data: FormFieldProps[]
  title: string
  setShowEdit: (show: boolean) => void
}): ReactElement {
  const { accountId } = useWeb3()
  const { ocean, config } = useOcean()
  const { ddo } = useAsset()
  const { isValid }: FormikContextType<ComputePrivacyForm> = useFormikContext()
  const [allAlgorithms, setAllAlgorithms] = useState<AssetSelectionAsset[]>()

  const { publisherTrustedAlgorithms } = ddo?.findServiceByType(
    'compute'
  ).attributes.main.privacy

  useEffect(() => {
    getAlgorithmsForAssetSelection(
      config.metadataCacheUri,
      publisherTrustedAlgorithms
    ).then((algorithms) => {
      setAllAlgorithms(algorithms)
    })
  }, [config.metadataCacheUri, publisherTrustedAlgorithms])

  return (
    <Form className={styles.form}>
      <h3 className={stylesIndex.title}>{title}</h3>
      {data.map((field: FormFieldProps) => (
        <Field
          key={field.name}
          {...field}
          options={
            field.name === 'publisherTrustedAlgorithms'
              ? allAlgorithms
              : field.options
          }
          component={Input}
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
