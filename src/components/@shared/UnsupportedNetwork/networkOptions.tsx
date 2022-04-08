import React, { ChangeEvent, ReactElement } from 'react'
import { useUserPreferences } from '@context/UserPreferences'
import { removeItemFromArray } from '@utils/index'
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
  const { chainIds, setChainIds } = useUserPreferences()
  const { networksList } = useNetworkMetadata()
  const { web3Provider } = useWeb3()

  async function changeNetwork(chainId: number) {
    console.log('chainId', chainId)
    const networkNode = await networksList.find(
      (data) => data.chainId === chainId
    )
    console.log('networkNode', networkNode)
    addCustomNetwork(web3Provider, networkNode)
  }

  function handleNetworkChanged(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target

    // storing all chainId everywhere as a number so convert from here
    const valueAsNumber = Number(value)

    const newChainIds = chainIds.includes(valueAsNumber)
      ? [...removeItemFromArray(chainIds, valueAsNumber)]
      : [...chainIds, valueAsNumber]
    setChainIds(newChainIds)
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
