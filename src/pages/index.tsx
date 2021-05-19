import React, { ReactElement } from 'react'
import { PageProps } from 'gatsby'
import { useSiteMetadata } from '../hooks/useSiteMetadata'
import Page from '../components/templates/Page'
import PageHome from '../components/pages/Home'

export default function PageGatsbyHome(props: PageProps): ReactElement {
  const { siteTitle, siteTagline } = useSiteMetadata()

  return (
    <Page
      title={siteTitle}
      description={siteTagline}
      uri={props.uri}
      headerCenter
    >
      <PageHome />
    </Page>
  )
}
