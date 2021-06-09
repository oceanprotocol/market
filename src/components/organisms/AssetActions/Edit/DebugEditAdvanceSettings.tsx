import { DDO, Credentials, CredentialType } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
import { AdvanceSettingsForm } from '../../../../models/FormEditCredential'
import { useOcean } from '../../../../providers/Ocean'
import DebugOutput from '../../../atoms/DebugOutput'

export interface AdvanceSettings {
  credentail: Credentials
  isOrderDisabled: boolean
}

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
  const [advanceSettings, setAdvanceSettings] = useState<AdvanceSettings>()

  useEffect(() => {
    if (!ocean) return

    async function transformValues() {
      const newDdo = await ocean.assets.updateCredentials(
        ddo,
        credentialType,
        values.allow,
        values.deny
      )
      setAdvanceSettings({
        credentail: newDdo.credentials,
        isOrderDisabled: values.isOrderDisabled
      })
    }
    transformValues()
  }, [values, ddo, ocean])

  return (
    <>
      <DebugOutput title="Collected Form Values" output={values} />
      <DebugOutput title="Transformed Form Values" output={advanceSettings} />
    </>
  )
}
