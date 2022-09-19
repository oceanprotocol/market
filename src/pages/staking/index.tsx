import React, { ReactElement, useEffect, useState } from 'react'
import Page from '@shared/Page'
import { accountTruncate } from '@utils/web3'
import { useWeb3 } from '@context/Web3'
import { useRouter } from 'next/router'
import web3 from 'web3'
import StakingPage from 'src/components/Staking'

export default function PageStaking(): ReactElement {
  const router = useRouter()
  const { accountId } = useWeb3()
  const [finalAccountId, setFinalAccountId] = useState<string>()

  // Have accountId in path take over, if not present fall back to web3
  useEffect(() => {
    async function init() {
      if (!router?.asPath) return

      // Path is root /profile, have web3 take over
      if (router.asPath === '/staking') {
        setFinalAccountId(accountId)
        return
      }

      const pathAccount = router.query.account as string

      // Path has ETH addreess
      if (web3.utils.isAddress(pathAccount)) {
        const finalAccountId = pathAccount || accountId
        setFinalAccountId(finalAccountId)
      }
    }
    init()
  }, [router, accountId])

  return (
    <Page
      uri={router.route}
      title={accountTruncate(finalAccountId)}
      noPageHeader
    >
      <StakingPage accountId={finalAccountId} />
    </Page>
  )
}
