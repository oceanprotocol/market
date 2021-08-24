import { useStaticQuery, graphql } from 'gatsby'

interface UseSiteMetadata {
  siteTitle: string
  siteTagline: string
  siteUrl: string
  siteIcon: string
  siteImage: { childImageSharp: { original: { src: string } } }
  copyright: string
  menu: {
    name: string
    link: string
  }[]
  warning: {
    main: string
    polygonPublish: string
  }
  announcement: {
    main: string
    polygon: string
  }
  appConfig: {
    metadataCacheUri: string
    infuraProjectId: string
    chainIds: number[]
    chainIdsSupported: number[]
    marketFeeAddress: string
    currencies: string[]
    portisId: string
    allowFixedPricing: string
    allowDynamicPricing: string
    allowFreePricing: string
    allowAdvancedSettings: string
    credentialType: string
    defaultPrivacyPolicySlug: string
    privacyPreferenceCenter: boolean
    allowAdvancedPublishSettings: string
  }
}

const query = graphql`
  query {
    site {
      siteMetadata {
        siteTitle
        siteTagline
        siteUrl
        siteIcon
        copyright
        menu {
          name
          link
        }
        warning {
          main
          polygonPublish
        }
        announcement {
          main
          polygon
        }
        appConfig {
          metadataCacheUri
          infuraProjectId
          chainIds
          chainIdsSupported
          marketFeeAddress
          currencies
          portisId
          allowFixedPricing
          allowDynamicPricing
          allowFreePricing
          allowAdvancedSettings
          allowAdvancedPublishSettings
          credentialType
          defaultPrivacyPolicySlug
          privacyPreferenceCenter
        }
      }
    }

    siteImage: allFile(filter: { relativePath: { eq: "site.json" } }) {
      edges {
        node {
          childContentJson {
            site {
              siteImage {
                childImageSharp {
                  original {
                    src
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export function useSiteMetadata(): UseSiteMetadata {
  const data = useStaticQuery(query)

  const siteMeta: UseSiteMetadata = {
    ...data.siteImage.edges[0].node.childContentJson.site,
    ...data.site.siteMetadata
  }

  return siteMeta
}
