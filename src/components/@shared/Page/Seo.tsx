import React, { ReactElement } from 'react'
import Head from 'next/head'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import { isBrowser } from '@utils/index'

export default function Seo({
  title,
  description,
  uri
}: {
  title?: string
  description?: string
  uri: string
}): ReactElement {
  const { siteTitle, siteTagline, siteUrl, siteImage } = useSiteMetadata()

  // Remove trailing slash from all URLs
  const canonical = `${siteUrl}${uri}`.replace(/\/$/, '')

  return (
    <Head>
      <html lang="en" />

      <title>{`${siteTitle} — ${siteTagline}`}</title>

      {isBrowser &&
        window.location &&
        window.location.hostname !== 'oceanprotocol.com' && (
          <meta name="robots" content="noindex,nofollow" />
        )}

      <link rel="canonical" href={canonical} />

      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={uri} />

      <meta name="image" content={`${siteUrl}${siteImage}`} />
      <meta property="og:image" content={`${siteUrl}${siteImage}`} />

      <meta property="og:site_name" content={siteTitle} />
      <meta name="twitter:creator" content="@oceanprotocol" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}
