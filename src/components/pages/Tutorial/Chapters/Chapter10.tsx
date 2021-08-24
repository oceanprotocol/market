import React from 'react'
import { ReactElement } from 'react-markdown'
import { useAsset } from '../../../../providers/Asset'
import AssetActionsWrapper from '../../../templates/AssetActionsWrapper'

export default function Chapter10({
  showPriceTutorial,
  showComputeTutorial
}: {
  showPriceTutorial: boolean
  showComputeTutorial: boolean
}): ReactElement {
  const { ddo } = useAsset()
  return (
    <>
      {ddo && showPriceTutorial && showComputeTutorial && (
        <AssetActionsWrapper uri={`/tutorial/${ddo.id}`} />
      )}
    </>
  )
}
