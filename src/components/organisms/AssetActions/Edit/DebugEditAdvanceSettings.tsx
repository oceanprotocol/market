import { DDO, ServiceComputePrivacy } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
import { AdvanceSettingsForm } from '../../../../models/FormEditCredential'
import { useOcean } from '../../../../providers/Ocean'
import DebugOutput from '../../../atoms/DebugOutput'
import { Credential } from '@oceanprotocol/lib/dist/node/ddo/interfaces/Credentials'

export default function DebugEditCredential({
  values,
  ddo
}: {
  values: AdvanceSettingsForm
  ddo: DDO
}): ReactElement {
  const { ocean } = useOcean()
  const [credential, setCredential] = useState<Credential>()

  useEffect(() => {
    if (!ocean) return

    async function transformValues() {
      // const credential = await transformComputeFormToServiceComputePrivacy(
      //   values,
      //   ocean
      // )
      // setCredential(credential)
    }
    transformValues()
  }, [values, ddo, ocean])

  return (
    <>
      <DebugOutput title="Collected Form Values" output={values} />
      <DebugOutput title="Transformed Form Values" output={ddo.credentials} />
    </>
  )
}
