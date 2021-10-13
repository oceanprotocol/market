import { useStaticQuery, graphql } from 'gatsby'
import { UseSiteMetadata } from './_types'

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
          rbacUrl
          darkModeConfig {
            classNameDark
            classNameLight
            storageKey
          }
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
