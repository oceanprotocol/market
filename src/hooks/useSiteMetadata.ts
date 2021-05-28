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
    chainIds: number[]
    marketFeeAddress: string
    currencies: string[]
    portisId: string
    allowFixedPricing: string
    allowDynamicPricing: string
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
          chainIds
          marketFeeAddress
          currencies
          portisId
          allowFixedPricing
          allowDynamicPricing
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
