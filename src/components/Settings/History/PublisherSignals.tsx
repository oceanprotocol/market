import React, { ReactElement } from 'react'
import { SignalOriginItem } from '@context/Signals/_types'
import AssetSignalsTab from './AssetSignals'

export default function PublisherSignalsTab(props: {
  accountId: string
  signalSettings: SignalOriginItem[]
}): ReactElement {
  return (
    <AssetSignalsTab
      signalSettings={props.signalSettings}
      accountId={props.accountId}
      signalType={2}
      signalTypeTitle={'Publisher'}
    />
  )
}
