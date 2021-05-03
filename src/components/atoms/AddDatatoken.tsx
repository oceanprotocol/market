import React, { ReactElement } from 'react'
import Button from './Button'
import { addTokenToWallet } from '../../utils/web3'
import { useWeb3 } from '../../providers/Web3'

export default function AddToken({
  address,
  symbol
}: {
  address: string
  symbol: string
}): ReactElement {
  const { web3Provider } = useWeb3()

  async function handleAddToken() {
    await addTokenToWallet(
      web3Provider,
      address,
      // TODO: figure out how to add full symbol
      symbol.substring(0, 6),
      'https://raw.githubusercontent.com/oceanprotocol/art/main/logo/datatoken.png'
    )
  }

  return (
    <Button style="text" size="small" onClick={handleAddToken}>
      {`Add ${symbol} to wallet`}
    </Button>
  )
}
