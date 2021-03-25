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
import { getAlgorithms } from '../../../../utils/aquarius'
import { transformDDOToAssetSelection } from '../../../../utils/compute'
import { useAsset } from '../../../../providers/Asset'
import { ComputePrivacyForm } from '../../../../models/FormEditComputeDataset'
import { publisherTrustedAlgorithm as PublisherTrustedAlgorithm } from '@oceanprotocol/lib'

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
  const {
    isValid,
    values
  }: FormikContextType<ComputePrivacyForm> = useFormikContext()
  const [allAlgorithms, setAllAlgorithms] = useState<AssetSelectionAsset[]>()

  const { publisherTrustedAlgorithms } = ddo?.findServiceByType(
    'compute'
  ).attributes.main.privacy

  async function getAlgorithmList(
    publisherTrustedAlgorithms: PublisherTrustedAlgorithm[]
  ): Promise<AssetSelectionAsset[]> {
    const query = {
      page: 1,
      query: {
        query_string: {
          query: `service.attributes.main.type:algorithm AND price.type:exchange -isInPurgatory:true`
        }
      },
      sort: { created: -1 }
    }
    const algorithmDDOList = await getAlgorithms(query, config.metadataCacheUri)
    const algorithmSelectionList = await transformDDOToAssetSelection(
      algorithmDDOList,
      config.metadataCacheUri,
      publisherTrustedAlgorithms
    )
    return algorithmSelectionList
  }

  useEffect(() => {
    getAlgorithmList(publisherTrustedAlgorithms).then((algorithms) => {
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
          disabled={
            field.name === 'publisherTrustedAlgorithms'
              ? values.allowAllPublishedAlgorithms
              : false
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
