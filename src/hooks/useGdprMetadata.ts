import { useStaticQuery, graphql } from 'gatsby'

export interface UseGdprMetadata {
  title: string
  text: string
  accept: string
  reject: string
  close: string
  placeholder: string
  optionalCookies?: {
    title: string
    desc: string
    cookieName: string
  }[]
}

const query = graphql`
  query GdprQuery {
    gdpr: allFile(filter: { relativePath: { eq: "gdpr.json" } }) {
      edges {
        node {
          childContentJson {
            title
            text
            accept
            reject
            close
            placeholder
            optionalCookies {
              title
              desc
              cookieName
            }
          }
        }
      }
    }
  }
`

export function useGdprMetadata(): UseGdprMetadata {
  const data = useStaticQuery(query)

  return { ...data.gdpr.edges[0].node.childContentJson }
}
