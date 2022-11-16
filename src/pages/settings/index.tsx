import React, { ReactElement } from 'react'
import Page from '@shared/Page'
import { useRouter } from 'next/router'
import SettingsPage from '../../components/Settings'
import { Asset } from '@oceanprotocol/lib'

declare type AssetListProps = {
  assets: Asset[]
  isLoading?: boolean
  noPublisher?: boolean
}

export default function PageSettings({
  assets,
  isLoading,
  noPublisher
}: AssetListProps): ReactElement {
  const router = useRouter()

  return (
    <Page uri={router.route} title="Settings" noPageHeader>
      <SettingsPage accountId={'123'} />
    </Page>
  )
}
