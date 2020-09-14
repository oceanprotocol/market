import React, { ReactElement } from 'react'
import { PageProps } from 'gatsby'
import PageTemplateAssetDetails from '../../components/templates/AssetDetails'

export default function PageGatsbyAssetDetails(props: PageProps): ReactElement {
  const did = props.location.pathname.split('/')[2]

  return <PageTemplateAssetDetails did={did} uri={props.location.pathname} />
}
