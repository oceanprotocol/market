import React, { ReactElement, useEffect } from 'react'
import Tabs from '@shared/atoms/Tabs'
import General from './General'
import AssetSignals from './AssetSignals'
import PublisherSignals from './PublisherSignals'
import styles from './index.module.css'
import { useWeb3 } from '@context/Web3'
import { SignalOriginItem } from '../../../@context/Signals/_types'
import { useUserPreferences } from '@context/UserPreferences'

interface HistoryTab {
  title: string
  content: JSX.Element
}

function getTabs(
  accountId: string,
  userAccountId: string,
  signalSettings: SignalOriginItem[]
): HistoryTab[] {
  const defaultTabs: HistoryTab[] = [
    {
      title: 'General',
      content: <General accountId={accountId} />
    },
    {
      title: 'Asset Signals',
      content: (
        <AssetSignals signalSettings={signalSettings} accountId={accountId} />
      )
    },
    {
      title: 'Publisher Signals',
      content: (
        <PublisherSignals
          signalSettings={signalSettings}
          accountId={accountId}
        />
      )
    }
  ]
  const computeTab: HistoryTab = {
    title: 'Compute Jobs',
    content: (
      <PublisherSignals signalSettings={signalSettings} accountId={accountId} />
    )
  }
  if (accountId === userAccountId) {
    defaultTabs.push(computeTab)
  }
  return defaultTabs
}

export default function HistoryPage({
  accountIdentifier
}: {
  accountIdentifier: string
}): ReactElement {
  const { accountId } = useWeb3()
  const { signals } = useUserPreferences()
  const url = new URL(location.href)
  const defaultTab = url.searchParams.get('defaultTab')
  let tabs = getTabs(accountIdentifier, accountId, signals)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    tabs = getTabs(accountIdentifier, accountId, signals)
  }, [signals])

  let defaultTabIndex = 0
  defaultTab === 'ComputeJobs' ? (defaultTabIndex = 4) : (defaultTabIndex = 0)

  return (
    <Tabs items={tabs} className={styles.tabs} defaultIndex={defaultTabIndex} />
  )
}
