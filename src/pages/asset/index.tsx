import React, { ReactElement } from 'react'
import { PageProps } from 'gatsby'
import { Router } from '@reach/router'
import PageTemplateAssetDetails from '../../components/templates/AssetDetails'

export default function PageGatsbyAssetDetails(props: PageProps): ReactElement {
  const did = props.location.pathname.split('/')[2]

  return (
    <Router basepath="/asset" location={props.location}>
      <PageTemplateAssetDetails
        path=":did"
        did={did}
        uri={props.location.pathname}
      />
    </Router>
  )
}
