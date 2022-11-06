import React, { ReactElement, useEffect, useState } from 'react'
import Page from '@shared/Page'
import ProfilePage from '../../components/Profile'
import { accountTruncate } from '@utils/web3'
import { useWeb3 } from '@context/Web3'
import ProfileProvider from '@context/Profile'
import { getEnsAddress, getEnsName } from '@utils/ens'
import { useRouter } from 'next/router'
import web3 from 'web3'
import { Chat } from '@pushprotocol/uiweb'

export default function PageProfile(): ReactElement {
  const router = useRouter()
  const { accountId, accountEns } = useWeb3()
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
        setFinalAccountId(accountId)
        setOwnAccount(true)
        return
      }

      const pathAccount = router.query.account as string

      // Path has ETH address
      if (web3.utils.isAddress(pathAccount)) {
        setOwnAccount(pathAccount === accountId)
        const finalAccountId = pathAccount || accountId
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
        setOwnAccount(resolvedAccountId === accountId)
        setFinalAccountId(resolvedAccountId)
      }
    }
    init()
  }, [router, accountId, accountEns])

  // Replace pathname with ENS name if present
  useEffect(() => {
    if (!finalAccountEns || router.asPath === '/profile') return

    const newProfilePath = `/profile/${finalAccountEns}`
    // make sure we only replace path once
    if (newProfilePath !== router.asPath) router.replace(newProfilePath)
  }, [router, finalAccountEns, accountId])

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
      <Chat
        account="0xBf4d452Be8b6c0Bf38525292A59e156CC60A7B22" // user address
        supportAddress="0x1Fc2BC9B9726aa914b396001f2312876aaB2b970" // support address
        apiKey="9uYRhy0hol.fDp4IHD7auZOFpNDDtz2Ql4i2W9RYj2tpA9TLWyuX4AmVIC3Ge9MtyAHJAWOB6je"
        env="staging"
      />
    </Page>
  )
}
