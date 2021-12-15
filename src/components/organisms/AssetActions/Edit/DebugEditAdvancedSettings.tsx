import { DDO, Credentials } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
import { AdvancedSettingsForm } from '../../../../models/FormEditCredential'
import { useOcean } from '../../../../providers/Ocean'
import DebugOutput from '../../../atoms/DebugOutput'

export interface AdvancedSettings {
  credentail: Credentials
  isOrderDisabled: boolean
}

enum CredentialType {
  address = 'address',
  credential3Box = 'credential3Box',
  domain = 'domain'
}

export default function DebugEditCredential({
  values,
  ddo,
  credentialType
}: {
  values: AdvancedSettingsForm
  ddo: DDO
  credentialType: CredentialType
}): ReactElement {
  const { ocean } = useOcean()
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>()

  useEffect(() => {
    if (!ocean) return

    async function transformValues() {
      const newDdo = await ocean.assets.updateCredentials(
        ddo,
        credentialType,
        values.allow,
        values.deny
      )
      setAdvancedSettings({
        credentail: newDdo.credentials,
        isOrderDisabled: values.isOrderDisabled
      })
    }
    transformValues()
  }, [values, ddo, ocean])

  return (
    <>
      <DebugOutput title="Collected Form Values" output={values} />
      <DebugOutput title="Transformed Form Values" output={advancedSettings} />
    </>
  )
}
