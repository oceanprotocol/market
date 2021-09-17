import React, { ReactElement, useEffect, useState } from 'react'
import Page from '../../components/templates/Page'
import { graphql, PageProps, navigate } from 'gatsby'
import ProfilePage from '../../components/pages/Profile'
import { accountTruncate } from '../../utils/web3'
import { useWeb3 } from '../../providers/Web3'
import ProfileProvider from '../../providers/Profile'
import { getEnsAddress, getEnsName } from '../../utils/ens'
import ethereumAddress from 'ethereum-address'

export default function PageGatsbyProfile(props: PageProps): ReactElement {
  const { accountId } = useWeb3()
  const [finalAccountId, setFinalAccountId] = useState<string>()
  const [accountEns, setAccountEns] = useState<string>()

  // Have accountId in path take over, if not present fall back to web3
  useEffect(() => {
    async function init() {
      if (!props?.location?.pathname) return
      const pathAccountId = props.location.pathname.split('/')[2]
      // Path is root /profile
      if (props.location.pathname === '/profile') {
        setAccountEns(null)
        setFinalAccountId(accountId)
        // navigate(`/profile`, { replace: true })
        return
      }

      // Path has ETH addreess
      if (ethereumAddress.isAddress(pathAccountId)) {
        const finalAccountId = pathAccountId || accountId
        setFinalAccountId(finalAccountId)

        const accountEns = await getEnsName(finalAccountId)
        if (!accountEns) return
        setAccountEns(accountEns)
      } else {
        // Path has ENS name
        setAccountEns(pathAccountId)
        const resolvedAccountId = await getEnsAddress(pathAccountId)
        setFinalAccountId(resolvedAccountId)
      }
    }
    init()
  }, [props.location.pathname, accountId])

  // Replace pathname with ENS name if present
  useEffect(() => {
    if (!accountEns || props.location.pathname === '/profile') return

    const newProfilePath = `/profile/${accountEns}`
    // make sure we only replace path once
    if (newProfilePath !== props.location.pathname)
      navigate(newProfilePath, { replace: true })
  }, [props.location, accountEns, accountId])

  return (
    <Page uri={props.uri} title={accountTruncate(finalAccountId)} noPageHeader>
      <ProfileProvider accountId={finalAccountId} accountEns={accountEns}>
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
