import React, { ReactElement } from 'react'
import Home from '../components/Home'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import Page from '@shared/Page'
import { useRouter } from 'next/router'

export default function PageHome(): ReactElement {
  const { siteTitle, siteTagline } = useSiteMetadata()
  const router = useRouter()

  return (
    <Page
      title={siteTitle}
      description={siteTagline}
      uri={router.route}
      headerCenter
    >
      <Home />
    </Page>
  )
}
