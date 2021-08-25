import React, { ReactElement, useState, useEffect } from 'react'
import Page from '../../components/templates/Page'
import { graphql, PageProps } from 'gatsby'
import AccountPage from '../../components/pages/Account'

export default function PageGatsbyAccount(props: PageProps): ReactElement {
  const content = (props.data as any).content.edges[0].node.childPagesJson
  const { title } = content
  const [accountId, setAccountId] = useState<string>()

  useEffect(() => {
    setAccountId(props.location.pathname.split('/')[2])
  }, [props.location.pathname])

  return (
    <Page title={title} uri={props.uri}>
      <AccountPage accountIdentifier={accountId} />
    </Page>
  )
}

export const contentQuery = graphql`
  query AccountPageQuery {
    content: allFile(filter: { relativePath: { eq: "pages/account.json" } }) {
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
