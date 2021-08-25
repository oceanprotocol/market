import React, { ReactElement, useEffect, useState } from 'react'
import Page from '../../components/templates/Page'
import { graphql, PageProps } from 'gatsby'
import ProfilePage from '../../components/pages/Profile'
import { accountTruncate } from '../../utils/web3'

export default function PageGatsbyProfile(props: PageProps): ReactElement {
  const [accountId, setAccountId] = useState<string>()

  useEffect(() => {
    setAccountId(props.location.pathname.split('/')[2])
  }, [props.location.pathname])

  return (
    <Page uri={props.uri} title={accountTruncate(accountId)} noPageHeader>
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
