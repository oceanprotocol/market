import React, { ReactElement, useEffect, useState } from 'react'
import Permission from '../../components/organisms/Permission'
import { PageProps } from 'gatsby'
import PageTemplateAssetDetails from '../../components/templates/PageAssetDetails'
import AssetProvider from '../../providers/Asset'

export default function PageGatsbyAssetDetails(props: PageProps): ReactElement {
  const [did, setDid] = useState<string>()

  useEffect(() => {
    setDid(props.location.pathname.split('/')[2])
  }, [props.location.pathname])

  return (
    <Permission eventType="browse">
      <AssetProvider asset={did}>
        <PageTemplateAssetDetails uri={props.location.pathname} />
      </AssetProvider>
    </Permission>
  )
}
