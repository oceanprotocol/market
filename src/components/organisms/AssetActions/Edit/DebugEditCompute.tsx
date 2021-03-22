import { DDO, ServiceComputePrivacy } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
import { ComputePrivacyForm } from '../../../../models/FormEditComputeDataset'
import { useOcean } from '../../../../providers/Ocean'
import { transformComputeFormToServiceComputePrivacy } from '../../../../utils/compute'
import DebugOutput from '../../../atoms/DebugOutput'

export default function DebugEditCompute({
  values,
  ddo
}: {
  values: ComputePrivacyForm
  ddo: DDO
}): ReactElement {
  const { ocean } = useOcean()
  const [
    formTransformed,
    setFormTransformed
  ] = useState<ServiceComputePrivacy>()

  useEffect(() => {
    if (!ocean) return

    async function transformValues() {
      const privacy = await transformComputeFormToServiceComputePrivacy(
        values,
        ddo,
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
