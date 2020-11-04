import React, { ReactElement } from 'react'
import { Helmet } from 'react-helmet'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'

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
    <Helmet
      defaultTitle={`${siteTitle} — ${siteTagline}`}
      titleTemplate={`%s — ${siteTitle}`}
      title={title}
    >
      <html lang="en" />

      {typeof window !== 'undefined' &&
        window.location &&
        window.location.hostname !== 'oceanprotocol.com' && (
          <meta name="robots" content="noindex,nofollow" />
        )}

      <link rel="canonical" href={canonical} />

      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={uri} />

      <meta
        name="image"
        content={`${siteUrl}${siteImage.childImageSharp.original.src}`}
      />
      <meta
        property="og:image"
        content={`${siteUrl}${siteImage.childImageSharp.original.src}`}
      />

      <meta property="og:site_name" content={siteTitle} />
      <meta name="twitter:creator" content="@oceanprotocol" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  )
}
