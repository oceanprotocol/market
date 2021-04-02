import React, { ReactElement } from 'react'
import { PageProps } from 'gatsby'
import PageHome from '../components/pages/Home'
import { useSiteMetadata } from '../hooks/useSiteMetadata'
import Page from '../components/templates/Page'

export default function PageGatsbyHome(props: PageProps): ReactElement {
  const { siteTagline } = useSiteMetadata() //siteTitle

  return (
    <Page
      title="deltaDAO Market" //{siteTitle}
      description={siteTagline}
      uri={props.uri}
      headerCenter
    >
      <PageHome />
    </Page>
  )
}
