import { DDO, Credentials } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
import { AdvancedSettingsForm } from '../../../../models/FormEditCredential'
import { useOcean } from '../../../../providers/Ocean'
import DebugOutput from '../../../atoms/DebugOutput'

export interface AdvancedSettings {
  credentail: Credentials
  isOrderDisabled: boolean
}

export default function DebugEditCredential({
  values
}: {
  values: AdvancedSettingsForm
}): ReactElement {
  const { ocean } = useOcean()
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>()

  useEffect(() => {
    if (!ocean) return

    async function transformValues() {
      const DebugCredential: Credentials = {
        allow: values?.allow,
        deny: values?.deny
      }
      setAdvancedSettings({
        credentail: DebugCredential,
        isOrderDisabled: values.isOrderDisabled
      })
    }
    transformValues()
  }, [values, ocean])

  return (
    <>
      <DebugOutput title="Collected Form Values" output={values} />
      <DebugOutput title="Transformed Form Values" output={advancedSettings} />
    </>
  )
}
