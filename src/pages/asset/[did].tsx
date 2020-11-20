import React, { ReactElement } from 'react'
import { PageProps } from 'gatsby'
import PageTemplateAssetDetails from '../../components/templates/PageAssetDetails'
import AssetProvider from '../../providers/Asset'

export default function PageGatsbyAssetDetails(props: PageProps): ReactElement {
  return (
    <AssetProvider asset={props.params.did}>
      <PageTemplateAssetDetails uri={props.location.pathname} />
    </AssetProvider>
  )
}
