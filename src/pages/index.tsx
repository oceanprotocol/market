import React, { ReactElement } from 'react'
import { PageProps } from 'gatsby'
import PageHome from '../components/Home/Home'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import Page from '@shared/Page'

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
