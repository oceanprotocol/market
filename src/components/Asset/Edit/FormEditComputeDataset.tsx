import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import Input from '@shared/FormInput'
import { AssetSelectionAsset } from '@shared/FormFields/AssetSelection'
import stylesIndex from './index.module.css'
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
import { ComputeEditForm } from './_types'
import content from '../../../../content/pages/editComputeDataset.json'
import { getFieldContent } from '@utils/form'

export default function FormEditComputeDataset(): ReactElement {
  const { asset } = useAsset()
  const { values }: FormikContextType<ComputeEditForm> = useFormikContext()
  const newCancelToken = useCancelToken()

  const [allAlgorithms, setAllAlgorithms] = useState<AssetSelectionAsset[]>()

  const getAlgorithmList = useCallback(
    async (
      publisherTrustedAlgorithms: PublisherTrustedAlgorithm[]
    ): Promise<AssetSelectionAsset[]> => {
      const baseParams = {
        chainIds: [asset.chainId],
        sort: { sortBy: SortTermOptions.Created },
        filters: [getFilterTerm('metadata.type', 'algorithm')]
      } as BaseQueryParams

      const query = generateBaseQuery(baseParams)
      const queryResult = await queryMetadata(query, newCancelToken())
      const datasetComputeService = getServiceByName(asset, 'compute')
      const algorithmSelectionList = await transformAssetToAssetSelection(
        datasetComputeService?.serviceEndpoint,
        queryResult?.results,
        publisherTrustedAlgorithms
      )
      return algorithmSelectionList
    },
    [asset, newCancelToken]
  )

  useEffect(() => {
    if (!asset) return

    const { publisherTrustedAlgorithms } = getServiceByName(
      asset,
      'compute'
    ).compute

    getAlgorithmList(publisherTrustedAlgorithms).then((algorithms) => {
      setAllAlgorithms(algorithms)
    })
  }, [asset, getAlgorithmList])

  return (
    <Form>
      <header className={stylesIndex.headerForm}>
        <h3 className={stylesIndex.titleForm}>{content.form.title}</h3>
        <p className={stylesIndex.descriptionForm}>
          {content.form.description}
        </p>
      </header>

      <Field
        {...getFieldContent('publisherTrustedAlgorithms', content.form.data)}
        component={Input}
        name="publisherTrustedAlgorithms"
        options={allAlgorithms}
        disabled={values.allowAllPublishedAlgorithms}
      />

      <Field
        {...getFieldContent('allowAllPublishedAlgorithms', content.form.data)}
        component={Input}
        name="allowAllPublishedAlgorithms"
        options={
          getFieldContent('allowAllPublishedAlgorithms', content.form.data)
            .options
        }
      />

      <FormActions />
    </Form>
  )
}
