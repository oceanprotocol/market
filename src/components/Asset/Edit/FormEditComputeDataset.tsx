import React, { ReactElement, useEffect, useState } from 'react'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Input, { InputProps } from '@shared/FormInput'
import { AssetSelectionAsset } from '@shared/FormFields/AssetSelection'
import stylesIndex from './index.module.css'
import styles from './FormEdit.module.css'
import {
  generateBaseQuery,
  getFilterTerm,
  queryMetadata
} from '@utils/aquarius'
import { useAsset } from '@context/Asset'
import { PublisherTrustedAlgorithm } from '@oceanprotocol/lib'
import FormActions from './FormActions'
import { useCancelToken } from '@hooks/useCancelToken'
import { SortTermOptions } from '../../../@types/aquarius/SearchQuery'
import { getServiceByName } from '@utils/ddo'
import { transformAssetToAssetSelection } from '@utils/assetConvertor'
import { useMarketMetadata } from '@context/MarketMetadata'

export default function FormEditComputeDataset({
  data,
  title
}: {
  data: InputProps[]
  title: string
}): ReactElement {
  const { appConfig } = useMarketMetadata()
  const { asset } = useAsset()
  const { values }: FormikContextType<ComputePrivacyForm> = useFormikContext()
  const [allAlgorithms, setAllAlgorithms] = useState<AssetSelectionAsset[]>()
  const newCancelToken = useCancelToken()
  const { publisherTrustedAlgorithms } = getServiceByName(
    asset,
    'compute'
  )?.compute

  async function getAlgorithmList(
    publisherTrustedAlgorithms: PublisherTrustedAlgorithm[]
  ): Promise<AssetSelectionAsset[]> {
    const baseParams = {
      chainIds: [asset.chainId],
      sort: { sortBy: SortTermOptions.Created },
      filters: [getFilterTerm('metadata.type', 'algorithm')]
    } as BaseQueryParams

    const query = generateBaseQuery(baseParams)
    const querryResult = await queryMetadata(query, newCancelToken())
    const datasetComputeService = getServiceByName(asset, 'compute')
    const algorithmSelectionList = await transformAssetToAssetSelection(
      datasetComputeService?.serviceEndpoint,
      querryResult?.results,
      publisherTrustedAlgorithms
    )
    return algorithmSelectionList
  }

  useEffect(() => {
    getAlgorithmList(publisherTrustedAlgorithms).then((algorithms) => {
      setAllAlgorithms(algorithms)
    })
  }, [appConfig, appConfig.metadataCacheUri, publisherTrustedAlgorithms])

  return (
    <Form className={styles.form}>
      <h3 className={stylesIndex.title}>{title}</h3>
      {data.map((field: InputProps) => (
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

      <FormActions />
    </Form>
  )
}
