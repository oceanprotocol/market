import React, { ReactElement, useEffect, useState } from 'react'
import { DDO } from '@oceanprotocol/lib'
import Button from './Button'
import { addTokenToWallet } from '../../utils/web3'
import { useWeb3 } from '../../providers/Web3'
import { getProviderInfo, IProviderInfo } from 'web3modal'

export default function AddToken({ ddo }: { ddo: DDO }): ReactElement {
  const { web3Provider } = useWeb3()
  const [providerInfo, setProviderInfo] = useState<IProviderInfo>()

  useEffect(() => {
    if (!web3Provider) return
    const providerInfo = getProviderInfo(web3Provider)
    setProviderInfo(providerInfo)
  }, [web3Provider])

  return (
    <>
      {providerInfo?.name === 'MetaMask' && (
        <Button
          style="text"
          size="small"
          onClick={() => {
            console.log('Add datatoken to wallet 1')
            addTokenToWallet(
              ddo.dataTokenInfo.address,
              ddo.dataTokenInfo.symbol,
              web3Provider
            )
          }}
        >
          {`Add ${ddo.dataTokenInfo.symbol} to wallet`}
        </Button>
      )}
    </>
  )
}
