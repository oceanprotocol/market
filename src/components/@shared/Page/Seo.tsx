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

  const pageTitle = title
    ? `${title} - ${siteTitle}`
    : `${siteTitle} — ${siteTagline}`

  return (
    <Head>
      <html lang="en" />

      <title>{pageTitle}</title>

      {isBrowser && window?.location?.hostname !== 'oceanprotocol.com' && (
        <meta name="robots" content="noindex,nofollow" />
      )}

      <link rel="canonical" href={canonical} />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="var(--background-content)" />

      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />

      <meta name="image" content={`${siteUrl}${siteImage}`} />
      <meta property="og:image" content={`${siteUrl}${siteImage}`} />

      <meta property="og:site_name" content={siteTitle} />
      <meta name="twitter:creator" content="@oceanprotocol" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}
