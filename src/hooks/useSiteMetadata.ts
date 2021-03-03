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
        appConfig {
          infuraProjectId
          network
          supportedNetworks
          marketFeeAddress
          currencies
          portisId
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
