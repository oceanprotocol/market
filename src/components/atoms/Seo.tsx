import React, { ReactElement } from 'react'
import { Helmet } from 'react-helmet'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import { isBrowser } from '../../utils'

export default function Seo({
  title,
  description,
  uri,
  metadescription
}: {
  title?: string
  description?: string
  uri: string
  metadescription: string
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

      <link rel="canonical" href={canonical} />

      <meta name="description" content={metadescription || description} />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={metadescription || description}
      />
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
      {isBrowser &&
        window.location &&
        window.location.hostname == 'market.oceanprotocol.com' && (
          <meta name="twitter:creator" content="@oceanprotocol" />
        )}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  )
}
