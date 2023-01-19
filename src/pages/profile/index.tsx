import React, { ReactElement, useEffect, useState } from 'react'
import Page from '@shared/Page'
import ProfilePage from '../../components/Profile'
import { accountTruncate } from '@utils/web3'
import ProfileProvider from '@context/Profile'
import { getEnsAddress, getEnsName } from '@utils/ens'
import { useRouter } from 'next/router'
import { useAccount, useEnsName } from 'wagmi'
import { utils } from 'ethers'

export default function PageProfile(): ReactElement {
  const router = useRouter()
  const { address } = useAccount()
  const { data: accountEns } = useEnsName({ address })
  const [finalAccountId, setFinalAccountId] = useState<string>()
  const [finalAccountEns, setFinalAccountEns] = useState<string>()
  const [ownAccount, setOwnAccount] = useState(false)

  // Have accountId in path take over, if not present fall back to web3
  useEffect(() => {
    async function init() {
      if (!router?.asPath) return

      // Path is root /profile, have web3 take over
      if (router.asPath === '/profile') {
        setFinalAccountEns(accountEns)
        setFinalAccountId(address)
        setOwnAccount(true)
        return
      }

      const pathAccount = router.query.account as string

      // Path has ETH address
      if (utils.isAddress(pathAccount)) {
        setOwnAccount(pathAccount === address)
        const finalAccountId = pathAccount || address
        setFinalAccountId(finalAccountId)

        const accountEns = await getEnsName(finalAccountId)
        if (!accountEns) return
        setFinalAccountEns(accountEns)
      } else {
        // Path has ENS name
        setFinalAccountEns(pathAccount)
        const resolvedAccountId = await getEnsAddress(pathAccount)
        if (
          !resolvedAccountId ||
          resolvedAccountId === '0x0000000000000000000000000000000000000000'
        )
          return
        setOwnAccount(resolvedAccountId === address)
        setFinalAccountId(resolvedAccountId)
      }
    }
    init()
  }, [router, address, accountEns])

  // Replace pathname with ENS name if present
  useEffect(() => {
    if (!finalAccountEns || router.asPath === '/profile') return

    const newProfilePath = `/profile/${finalAccountEns}`
    // make sure we only replace path once
    if (newProfilePath !== router.asPath) router.replace(newProfilePath)
  }, [router, finalAccountEns, address])

  return (
    <Page
      uri={router.route}
      title={accountTruncate(finalAccountId)}
      noPageHeader
    >
      <ProfileProvider
        accountId={finalAccountId}
        accountEns={finalAccountEns}
        ownAccount={ownAccount}
      >
        <ProfilePage accountId={finalAccountId} />
      </ProfileProvider>
    </Page>
  )
}
