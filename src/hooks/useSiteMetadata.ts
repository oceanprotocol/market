import { useStaticQuery, graphql } from 'gatsby'

const query = graphql`
  query {
    allFile(filter: { relativePath: { eq: "site.json" } }) {
      edges {
        node {
          childContentJson {
            site {
              siteTitle
              siteTagline
              siteDescription
              siteUrl
              siteIcon
              siteImage {
                childImageSharp {
                  original {
                    src
                  }
                }
              }
              analyticsId
              company {
                name
                address {
                  location
                  street
                  city
                  zip
                  country
                }
              }
              social {
                name
                url
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
  return data.allFile.edges[0].node.childContentJson.site
}
