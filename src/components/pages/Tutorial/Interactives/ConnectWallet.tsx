import React from 'react'
import { ReactElement } from 'react-markdown'
import Wallet from '../../../molecules/Wallet'
import Page from '../../../templates/Page'

export default function ConnectWallet(): ReactElement {
  return (
    <Page
      title="Connect Wallet"
      description="Connect your wallet here"
      uri="/tutorial"
    >
      <Wallet />
    </Page>
  )
}
