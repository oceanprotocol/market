import { Asset, ServiceComputeOptions } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
// import { transformComputeFormToServiceComputePrivacy } from '@utils/compute'
import DebugOutput from '@shared/DebugOutput'
import { useCancelToken } from '@hooks/useCancelToken'
import { transformComputeFormToServiceComputeOptions } from '@utils/compute'

export default function DebugEditCompute({
  values,
  asset
}: {
  values: ComputePrivacyForm
  asset: Asset
}): ReactElement {
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
  }, [values, asset])

  return (
    <>
      <DebugOutput title="Collected Form Values" output={values} />
      <DebugOutput title="Transformed Form Values" output={formTransformed} />
    </>
  )
}
