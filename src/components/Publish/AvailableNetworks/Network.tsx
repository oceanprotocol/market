import React, { ReactElement } from 'react'
import NetworkName from '@shared/NetworkName'
import styles from './Network.module.css'
import Button from '@shared/atoms/Button'
import useNetworkMetadata from '@hooks/useNetworkMetadata'
// TODO: import { addCustomNetwork } from '@utils/wallet'

export default function Network({
  chainId
}: {
  chainId: number
}): ReactElement {
  const { networksList } = useNetworkMetadata()

  function changeNetwork(chainId: number) {
    const networkNode = networksList.find((data) => data.chainId === chainId)
    // addCustomNetwork(networkNode)
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
