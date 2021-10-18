import React, { ReactElement, useEffect, useState } from 'react'
import { PageProps } from 'gatsby'
import PageTemplateAssetDetails from '../../components/Asset'
import AssetProvider from '@context/Asset'
import OceanProvider from '@context/Ocean'

export default function PageGatsbyAssetDetails(props: PageProps): ReactElement {
  const [did, setDid] = useState<string>()

  useEffect(() => {
    setDid(props.location.pathname.split('/')[2])
  }, [props.location.pathname])

  return (
    <AssetProvider asset={did}>
      <OceanProvider>
        <PageTemplateAssetDetails uri={props.location.pathname} />
      </OceanProvider>
    </AssetProvider>
  )
}
