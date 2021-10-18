import { DDO, ServiceComputePrivacy } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean } from '@context/Ocean'
import { transformComputeFormToServiceComputePrivacy } from '@utils/compute'
import DebugOutput from '@shared/DebugOutput'

export default function DebugEditCompute({
  values,
  ddo
}: {
  values: ComputePrivacyForm
  ddo: DDO
}): ReactElement {
  const { ocean } = useOcean()
  const [formTransformed, setFormTransformed] =
    useState<ServiceComputePrivacy>()

  useEffect(() => {
    if (!ocean) return

    async function transformValues() {
      const privacy = await transformComputeFormToServiceComputePrivacy(
        values,
        ocean
      )
      setFormTransformed(privacy)
    }
    transformValues()
  }, [values, ddo, ocean])

  return (
    <>
      <DebugOutput title="Collected Form Values" output={values} />
      <DebugOutput title="Transformed Form Values" output={formTransformed} />
    </>
  )
}
