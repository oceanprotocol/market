import React, { ReactElement, useEffect, useState } from 'react'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Input, { InputProps } from '@shared/Form/Input'
import { AssetSelectionAsset } from '@shared/Form/FormFields/AssetSelection'
import stylesIndex from './index.module.css'
import styles from './FormEditMetadata.module.css'
import {
  generateBaseQuery,
  getFilterTerm,
  queryMetadata,
  transformDDOToAssetSelection
} from '@utils/aquarius'
import { useAsset } from '@context/Asset'
import { publisherTrustedAlgorithm as PublisherTrustedAlgorithm } from '@oceanprotocol/lib'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import FormActions from './FormActions'
import { useCancelToken } from '@hooks/useCancelToken'
import { SortTermOptions } from '../../../../@types/aquarius/SearchQuery'
import { getServiceByName } from '@utils/ddo'

export default function FormEditComputeDataset({
  data,
  title,
  setShowEdit
}: {
  data: InputProps[]
  title: string
  setShowEdit: (show: boolean) => void
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const { ddo } = useAsset()
  const { values }: FormikContextType<ComputePrivacyForm> = useFormikContext()
  const [allAlgorithms, setAllAlgorithms] = useState<AssetSelectionAsset[]>()
  const newCancelToken = useCancelToken()
  const { publisherTrustedAlgorithms } = getServiceByName(
    ddo,
    'compute'
  ).privacy

  async function getAlgorithmList(
    publisherTrustedAlgorithms: PublisherTrustedAlgorithm[]
  ): Promise<AssetSelectionAsset[]> {
    const baseParams = {
      chainIds: [ddo.chainId],
      sort: { sortBy: SortTermOptions.Created },
      filters: [getFilterTerm('service.attributes.main.type', 'algorithm')]
    } as BaseQueryParams

    const query = generateBaseQuery(baseParams)
    const querryResult = await queryMetadata(query, newCancelToken())
    const datasetComputeService = getServiceByName(ddo, 'compute')
    const algorithmSelectionList = await transformDDOToAssetSelection(
      datasetComputeService?.serviceEndpoint,
      querryResult.results,
      publisherTrustedAlgorithms,
      newCancelToken()
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

      <FormActions setShowEdit={setShowEdit} />
    </Form>
  )
}
