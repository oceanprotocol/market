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
              siteUrl
              copyright
              menu {
                name
                link
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
