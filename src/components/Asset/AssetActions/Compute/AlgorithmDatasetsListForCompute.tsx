import React, { ReactElement, useEffect, useState } from 'react'
import styles from './AlgorithmDatasetsListForCompute.module.css'
import { getAlgorithmDatasetsForCompute } from '@utils/aquarius'
import { AssetSelectionAsset } from '@shared/FormFields/AssetSelection'
import AssetComputeList from '@shared/AssetList/AssetComputeList'
import { useCancelToken } from '@hooks/useCancelToken'
import { getServiceByName } from '@utils/ddo'
import { Asset } from '@oceanprotocol/lib'
import { AssetExtended } from 'src/@types/AssetExtended'

export default function AlgorithmDatasetsListForCompute({
  asset,
  algorithmDid
}: {
  asset: AssetExtended
  algorithmDid: string
}): ReactElement {
  const [datasetsForCompute, setDatasetsForCompute] =
    useState<AssetSelectionAsset[]>()
  const newCancelToken = useCancelToken()

  useEffect(() => {
    if (!asset) return

    async function getDatasetsAllowedForCompute() {
      const isCompute = Boolean(getServiceByName(asset, 'compute'))
      const datasetComputeService = getServiceByName(
        asset,
        isCompute ? 'compute' : 'access'
      )
      const datasets = await getAlgorithmDatasetsForCompute(
        algorithmDid,
        datasetComputeService?.serviceEndpoint,
        asset?.chainId,
        newCancelToken()
      )
      setDatasetsForCompute(datasets)
    }
    asset.metadata.type === 'algorithm' && getDatasetsAllowedForCompute()
  }, [asset?.metadata?.type])

  return (
    <div className={styles.datasetsContainer}>
      <h3 className={styles.text}>Datasets algorithm is allowed to run on</h3>
      <AssetComputeList assets={datasetsForCompute} />
    </div>
  )
}
