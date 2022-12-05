import React, { ReactElement } from 'react'
import { useRouter } from 'next/router'
import PageTemplateAssetDetails from '../../../components/Asset'
import AssetProvider from '@context/Asset'

export default function PageAssetDetails(): ReactElement {
  const router = useRouter()
  const { did } = router.query
  return (
    <AssetProvider did={did as string}>
      <PageTemplateAssetDetails uri={router.asPath} />
    </AssetProvider>
  )
}
