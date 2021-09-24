import React, { ReactElement, useEffect, useState } from 'react'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Input from '../../../atoms/Input'
import { FormFieldProps } from '../../../../@types/Form'
import { AssetSelectionAsset } from '../../../molecules/FormFields/AssetSelection'
import stylesIndex from './index.module.css'
import styles from './FormEditMetadata.module.css'
import {
  queryMetadata,
  transformDDOToAssetSelection
} from '../../../../utils/aquarius'
import { useAsset } from '../../../../providers/Asset'
import { ComputePrivacyForm } from '../../../../models/FormEditComputeDataset'
import { publisherTrustedAlgorithm as PublisherTrustedAlgorithm } from '@oceanprotocol/lib'
import axios from 'axios'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'
import FormActions from './FormActions'

export default function FormEditComputeDataset({
  data,
  title,
  setShowEdit
}: {
  data: FormFieldProps[]
  title: string
  setShowEdit: (show: boolean) => void
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const { ddo } = useAsset()
  const { values }: FormikContextType<ComputePrivacyForm> = useFormikContext()
  const [allAlgorithms, setAllAlgorithms] = useState<AssetSelectionAsset[]>()

  const { publisherTrustedAlgorithms } =
    ddo?.findServiceByType('compute').attributes.main.privacy

  async function getAlgorithmList(
    publisherTrustedAlgorithms: PublisherTrustedAlgorithm[]
  ): Promise<AssetSelectionAsset[]> {
    const source = axios.CancelToken.source()
    const query = {
      query: {
        query_string: {
          query: `service.attributes.main.type:algorithm AND chainId:${ddo.chainId} -isInPurgatory:true`
        }
      },
      sort: { created: 'desc' }
    }
    const querryResult = await queryMetadata(query, source.token)
    const datasetComputeService = ddo.findServiceByType('compute')
    const algorithmSelectionList = await transformDDOToAssetSelection(
      datasetComputeService?.serviceEndpoint,
      querryResult.results,
      publisherTrustedAlgorithms
    )
    return algorithmSelectionList
  }

  useEffect(() => {
    getAlgorithmList(publisherTrustedAlgorithms).then((algorithms) => {
      setAllAlgorithms(algorithms)
    })
  }, [appConfig.metadataCacheUri, publisherTrustedAlgorithms])

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

      <FormActions setShowEdit={setShowEdit} />
    </Form>
  )
}
