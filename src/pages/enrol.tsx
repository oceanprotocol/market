import React, { ReactElement } from 'react'
import PageEnrol from '../components/pages/enrol'
import { useSiteMetadata } from '../hooks/useSiteMetadata'
import Page from '../components/templates/Page'
import { graphql, PageProps } from 'gatsby'

export default function PageGatsbyEnrol(props: PageProps): ReactElement {
  const { siteTitle, siteTagline } = useSiteMetadata()
  const content = (props.data as any).content.edges[0].node.childPagesJson
  const { title, description } = content
  return (
    <Page
      title="Enrolment Required To Publish Data Assets"
      description=""
      uri={props.uri}
      headerCenter
    >
      <PageEnrol content={content} />
    </Page>
  )
}

export const contentQuery = graphql`
  query EnrolPageQuery {
    content: allFile(filter: { relativePath: { eq: "pages/enrol.json" } }) {
      edges {
        node {
          childPagesJson {
            title
            description
            warning
            infolinks {
              title
              links {
                text
                url
                blank
              }
            }
          }
        }
      }
    }
  }
`
