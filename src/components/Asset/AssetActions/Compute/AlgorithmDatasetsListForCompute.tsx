import React, { ReactElement, useEffect, useState } from 'react'
import styles from './AlgorithmDatasetsListForCompute.module.css'
import { getAlgorithmDatasetsForCompute } from '@utils/aquarius'
import { AssetSelectionAsset } from '@shared/FormFields/AssetSelection'
import AssetComputeList from '@shared/AssetList/AssetComputeList'
import { useAsset } from '@context/Asset'
import { useCancelToken } from '@hooks/useCancelToken'
import { getServiceByName } from '@utils/ddo'

export default function AlgorithmDatasetsListForCompute({
  algorithmDid,
  dataset
}: {
  algorithmDid: string
  dataset: Asset
}): ReactElement {
  const { ddo } = useAsset()
  const [datasetsForCompute, setDatasetsForCompute] =
    useState<AssetSelectionAsset[]>()
  const newCancelToken = useCancelToken()
  useEffect(() => {
    async function getDatasetsAllowedForCompute() {
      const isCompute = Boolean(getServiceByName(dataset, 'compute'))
      const datasetComputeService = getServiceByName(
        dataset,
        isCompute ? 'compute' : 'access'
      )
      const datasets = await getAlgorithmDatasetsForCompute(
        algorithmDid,
        datasetComputeService?.serviceEndpoint,
        dataset?.chainId,
        newCancelToken()
      )
      setDatasetsForCompute(datasets)
    }
    ddo.metadata.type === 'algorithm' && getDatasetsAllowedForCompute()
  }, [ddo.metadata.type])

  return (
    <div className={styles.datasetsContainer}>
      <h3 className={styles.text}>Datasets algorithm is allowed to run on</h3>
      <AssetComputeList assets={datasetsForCompute} />
    </div>
  )
}
