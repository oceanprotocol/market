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
    infuraProjectId: string
    network: string
    marketFeeAddress: string
    currencies: string[]
    portisId: string
    allowFixedPricing: string
    allowDynamicPricing: string
    allowAdvancedSettings: string
    credentialType: string
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
          infuraProjectId
          network
          marketFeeAddress
          currencies
          portisId
          allowFixedPricing
          allowDynamicPricing
          allowAdvancedSettings
          credentialType
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
