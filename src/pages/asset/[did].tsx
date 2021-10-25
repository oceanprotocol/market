import React, { ReactElement } from 'react'
import { useRouter } from 'next/router'
import PageTemplateAssetDetails from '../../components/Asset'
import AssetProvider from '@context/Asset'
import OceanProvider from '@context/Ocean'

export default function PageAssetDetails(): ReactElement {
  const router = useRouter()
  const { did } = router.query

  return (
    <AssetProvider asset={did as string}>
      <OceanProvider>
        <PageTemplateAssetDetails uri={router.pathname} />
      </OceanProvider>
    </AssetProvider>
  )
}
