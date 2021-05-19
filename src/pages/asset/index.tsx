import React, { ReactElement, useEffect, useState } from 'react'
import { PageProps } from 'gatsby'
import AssetProvider from '../../providers/Asset'
import PageTemplateAssetDetails from '../../components/templates/PageAssetDetails'

export default function PageGatsbyAssetDetails(props: PageProps): ReactElement {
  const [did, setDid] = useState<string>()

  useEffect(() => {
    setDid(props.location.pathname.split('/')[2])
  }, [props.location.pathname])

  return (
    <AssetProvider asset={did}>
      <PageTemplateAssetDetails uri={props.location.pathname} />
    </AssetProvider>
  )
}
