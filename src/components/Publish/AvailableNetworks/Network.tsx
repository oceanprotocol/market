import React, { ReactElement } from 'react'
import NetworkName from '@shared/NetworkName'
import styles from './Network.module.css'
import Button from '@shared/atoms/Button'
import useNetworkMetadata from '@hooks/useNetworkMetadata'
import { addCustomNetwork } from '@utils/web3'
import { useProvider } from 'wagmi'

export default function Network({
  chainId
}: {
  chainId: number
}): ReactElement {
  const { networksList } = useNetworkMetadata()
  const web3Provider = useProvider()

  function changeNetwork(chainId: number) {
    const networkNode = networksList.find((data) => data.chainId === chainId)
    addCustomNetwork(web3Provider, networkNode)
  }

  return (
    <Button
      style="text"
      className={styles.button}
      onClick={() => changeNetwork(chainId)}
    >
      <NetworkName key={chainId} networkId={chainId} />
    </Button>
  )
}
