import React, { ReactElement, useEffect, useState } from 'react'
import styles from './AlgorithmDatasetsListForCompute.module.css'
import { getAlgorithmDatasetsForCompute } from '../../../utils/aquarius'
import { AssetSelectionAsset } from '../../molecules/FormFields/AssetSelection'
import AssetComputeList from '../../molecules/AssetComputeList'
import { useAsset } from '../../../providers/Asset'
import { DDO } from '@oceanprotocol/lib'
import { useCancelToken } from '../../../hooks/useCancelToken'

export default function AlgorithmDatasetsListForCompute({
  algorithmDid,
  dataset
}: {
  algorithmDid: string
  dataset: DDO
}): ReactElement {
  const { type } = useAsset()
  const [datasetsForCompute, setDatasetsForCompute] =
    useState<AssetSelectionAsset[]>()
  const newCancelToken = useCancelToken()
  useEffect(() => {
    async function getDatasetsAllowedForCompute() {
      const isCompute = Boolean(dataset?.findServiceByType('compute'))
      const datasetComputeService = dataset.findServiceByType(
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
    type === 'algorithm' && getDatasetsAllowedForCompute()
  }, [type])

  return (
    <div className={styles.datasetsContainer}>
      <h3 className={styles.text}>Datasets algorithm is allowed to run on</h3>
      <AssetComputeList assets={datasetsForCompute} />
    </div>
  )
}
