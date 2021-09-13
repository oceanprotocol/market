import React, { ReactElement, useEffect, useState } from 'react'
import Page from '../../components/templates/Page'
import { graphql, PageProps } from 'gatsby'
import ProfilePage from '../../components/pages/Profile'
import { accountTruncate } from '../../utils/web3'
import { useWeb3 } from '../../providers/Web3'
import ProfileProvider from '../../providers/Profile'

export default function PageGatsbyProfile(props: PageProps): ReactElement {
  const { accountId } = useWeb3()
  const [finalAccountId, setFinalAccountId] = useState<string>()

  // Have accountId in path take over, if not present fall back to web3
  useEffect(() => {
    const pathAccountId = props.location.pathname.split('/')[2]
    const finalAccountId = pathAccountId || accountId
    setFinalAccountId(finalAccountId)
  }, [props.location.pathname, accountId])

  return (
    <Page uri={props.uri} title={accountTruncate(finalAccountId)} noPageHeader>
      <ProfileProvider accountId={finalAccountId}>
        <ProfilePage accountId={finalAccountId} />
      </ProfileProvider>
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
