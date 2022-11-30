import React, { ReactElement } from 'react'
import Page from '@shared/Page'
import { useRouter } from 'next/router'
import SettingsPage from '../../components/Settings'

export default function PageSettings(): ReactElement {
  const router = useRouter()

  return (
    <Page uri={router.route} title="Settings" noPageHeader>
      <SettingsPage accountId={'123'} />
    </Page>
  )
}
