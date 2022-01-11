import { Asset, ServiceComputeOptions } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
// import { transformComputeFormToServiceComputePrivacy } from '@utils/compute'
import DebugOutput from '@shared/DebugOutput'

export default function DebugEditCompute({
  values,
  ddo
}: {
  values: ComputePrivacyForm
  ddo: Asset
}): ReactElement {
  const [formTransformed, setFormTransformed] =
    useState<ServiceComputeOptions>()

  useEffect(() => {
    // async function transformValues() {
    //   const privacy = await transformComputeFormToServiceComputePrivacy(values)
    //   setFormTransformed(privacy)
    // }
    // transformValues()
  }, [values, ddo])

  return (
    <>
      <DebugOutput title="Collected Form Values" output={values} />
      <DebugOutput title="Transformed Form Values" output={formTransformed} />
    </>
  )
}
