import React, { ReactElement } from 'react'
import { PageProps } from 'gatsby'
import PageTemplateAssetDetails from '../../components/templates/PageAssetDetails'
import { AssetProvider } from '@oceanprotocol/react'

export default function PageGatsbyAssetDetails(props: PageProps): ReactElement {
  const did = props.location.pathname.split('/')[2]

  return (
    <AssetProvider asset={did}>
      <PageTemplateAssetDetails did={did} uri={props.location.pathname} />
    </AssetProvider>
  )
}
