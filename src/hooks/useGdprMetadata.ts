import { useStaticQuery, graphql } from 'gatsby'

const query = graphql`
  query CookieSetingsQuery {
    gdpr: allFile(filter: { relativePath: { eq: "gdpr.json" } }) {
      edges {
        node {
          childContentJson {
            cookies {
              cookieName
              text
              accept
              reject
            }
            forms
            newsletter
          }
        }
      }
    }
  }
`

export function useGdprMetadata() {
  const data = useStaticQuery(query)
  return data.gdpr.edges[0].node.childContentJson
}
