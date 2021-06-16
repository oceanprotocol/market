import React, { ReactElement, useEffect, useState } from 'react'
import styles from './AlgorithmDatasetsListForCompute.module.css'
import { getAlgorithmDatasetsForCompute } from '../../../utils/aquarius'
import { AssetSelectionAsset } from '../../molecules/FormFields/AssetSelection'
import AssetComputeList from '../../molecules/AssetComputeList'
import { useOcean } from '../../../providers/Ocean'
import { useAsset } from '../../../providers/Asset'

export default function AlgorithmDatasetsListForCompute({
  algorithmDid
}: {
  algorithmDid: string
}): ReactElement {
  const { config } = useOcean()
  const { type } = useAsset()
  const [datasetsForCompute, setDatasetsForCompute] =
    useState<AssetSelectionAsset[]>()

  useEffect(() => {
    async function getDatasetsAllowedForCompute() {
      const datasets = await getAlgorithmDatasetsForCompute(
        algorithmDid,
        config.metadataCacheUri
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
