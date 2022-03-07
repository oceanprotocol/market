import React, { ReactElement } from 'react'
import { useRouter } from 'next/router'
import EditPage from '../../../components/Asset/Edit'
import AssetProvider from '@context/Asset'

export default function PageEditAsset(): ReactElement {
  const router = useRouter()
  const { did } = router.query
  return (
    <AssetProvider did={did as string}>
      <EditPage uri={router.pathname} />
    </AssetProvider>
  )
}
