import { DDO, Credentials, CredentialType } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
import { AdvanceSettingsForm } from '../../../../models/FormEditCredential'
import { useOcean } from '../../../../providers/Ocean'
import DebugOutput from '../../../atoms/DebugOutput'

export default function DebugEditCredential({
  values,
  ddo,
  credentialType
}: {
  values: AdvanceSettingsForm
  ddo: DDO
  credentialType: CredentialType
}): ReactElement {
  const { ocean } = useOcean()
  const [credential, setCredential] = useState<Credentials>()

  useEffect(() => {
    if (!ocean) return

    async function transformValues() {
      const newDdo = await ocean.assets.updateCredentials(
        ddo,
        credentialType,
        values.allowCredentail,
        [] // TODO: denyCredential
      )
      setCredential(newDdo.credentials)
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
