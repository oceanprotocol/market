import React, { ReactElement, useEffect, useState } from 'react'
import { PageProps } from 'gatsby'
import PageTemplateAssetDetails from '../../components/templates/PageAssetDetails'
import AssetProvider from '../../providers/Asset'
import OceanProvider from '../../providers/Ocean'

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
