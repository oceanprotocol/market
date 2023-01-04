import { Asset, ServiceComputeOptions } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
import DebugOutput from '@shared/DebugOutput'
import { useCancelToken } from '@hooks/useCancelToken'
import { transformComputeFormToServiceComputeOptions } from '@utils/compute'
import { ComputeEditForm } from './_types'
import { previewDebugPatch } from '@utils/ddo'

export default function DebugEditCompute({
  values,
  asset
}: {
  values: ComputeEditForm
  asset: Asset
}): ReactElement {
  const [valuePreview, setValuePreview] = useState({})
  const [formTransformed, setFormTransformed] =
    useState<ServiceComputeOptions>()
  const newCancelToken = useCancelToken()

  useEffect(() => {
    async function transformValues() {
      const privacy = await transformComputeFormToServiceComputeOptions(
        values,
        asset.services[0].compute,
        asset.chainId,
        newCancelToken()
      )
      setFormTransformed(privacy)
    }
    transformValues()
    setValuePreview(previewDebugPatch(values, asset.chainId))
  }, [values, asset])

  return (
    <>
      <DebugOutput title="Collected Form Values" output={valuePreview} />
      <DebugOutput title="Transformed Form Values" output={formTransformed} />
    </>
  )
}
