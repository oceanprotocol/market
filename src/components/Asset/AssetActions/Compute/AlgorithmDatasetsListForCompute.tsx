import React, { ReactElement, useEffect, useState } from 'react'
import styles from './AlgorithmDatasetsListForCompute.module.css'
import { getAlgorithmDatasetsForCompute } from '@utils/aquarius'
import { AssetSelectionAsset } from '@shared/FormFields/AssetSelection'
import AssetComputeList from '@shared/AssetList/AssetComputeList'
import { useCancelToken } from '@hooks/useCancelToken'
import { getServiceByName } from '@utils/ddo'

export default function AlgorithmDatasetsListForCompute({
  ddo,
  algorithmDid
}: {
  ddo: Asset
  algorithmDid: string
}): ReactElement {
  const [datasetsForCompute, setDatasetsForCompute] =
    useState<AssetSelectionAsset[]>()
  const newCancelToken = useCancelToken()

  useEffect(() => {
    if (!ddo) return

    async function getDatasetsAllowedForCompute() {
      const isCompute = Boolean(getServiceByName(ddo, 'compute'))
      const datasetComputeService = getServiceByName(
        ddo,
        isCompute ? 'compute' : 'access'
      )
      const datasets = await getAlgorithmDatasetsForCompute(
        algorithmDid,
        datasetComputeService?.serviceEndpoint,
        ddo?.chainId,
        newCancelToken()
      )
      setDatasetsForCompute(datasets)
    }
    ddo.metadata.type === 'algorithm' && getDatasetsAllowedForCompute()
  }, [ddo?.metadata?.type])

  return (
    <div className={styles.datasetsContainer}>
      <h3 className={styles.text}>Datasets algorithm is allowed to run on</h3>
      <AssetComputeList assets={datasetsForCompute} />
    </div>
  )
}
