import React, { ReactElement, useState, useEffect } from 'react'
import Page from '../../components/templates/Page'
import { graphql, PageProps } from 'gatsby'
import ProfilePage from '../../components/pages/Profile'

export default function PageGatsbyProfile(props: PageProps): ReactElement {
  const content = (props.data as any).content.edges[0].node.childPagesJson
  const { title } = content
  const [accountId, setAccountId] = useState<string>()

  useEffect(() => {
    setAccountId(props.location.pathname.split('/')[2])
  }, [props.location.pathname])

  return (
    <Page uri={props.uri}>
      <ProfilePage accountIdentifier={accountId} />
    </Page>
  )
}

export const contentQuery = graphql`
  query ProfilePageQuery {
    content: allFile(filter: { relativePath: { eq: "pages/profile.json" } }) {
      edges {
        node {
          childPagesJson {
            title
            description
          }
        }
      }
    }
  }
`
