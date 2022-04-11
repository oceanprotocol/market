import React, { ReactElement } from 'react'
import NetworkName from '@shared/NetworkName'
import styles from './NetworkOptions.module.css'
import Button from '@shared/atoms/Button'
import useNetworkMetadata from '@hooks/useNetworkMetadata'
import { addCustomNetwork } from '@utils/web3'
import { useWeb3 } from '@context/Web3'

export default function NetworkOptions({
  chainId
}: {
  chainId: number
}): ReactElement {
  const { networksList } = useNetworkMetadata()
  const { web3Provider } = useWeb3()

  function changeNetwork(chainId: number) {
    const networkNode = networksList.find((data) => data.chainId === chainId)
    addCustomNetwork(web3Provider, networkNode)
  }

  return (
    <div key={chainId}>
      <label className={styles.radioLabel} htmlFor={`opt-${chainId}`}>
        <Button
          style="text"
          className={styles.button}
          onClick={() => changeNetwork(chainId)}
        >
          <NetworkName key={chainId} networkId={chainId} />
        </Button>
      </label>
    </div>
  )
}
