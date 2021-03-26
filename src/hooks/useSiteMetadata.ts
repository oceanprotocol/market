import { useStaticQuery, graphql } from 'gatsby'

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
        warning
        warningPolygon
        warningPolygonNetwork
        warningPolygonPublish
        appConfig {
          infuraProjectId
          network
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

export function useSiteMetadata() {
  const data = useStaticQuery(query)

  const siteMeta = {
    ...data.siteImage.edges[0].node.childContentJson.site,
    ...data.site.siteMetadata
  }

  return siteMeta
}
