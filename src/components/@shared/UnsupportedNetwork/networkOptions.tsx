import React, { ChangeEvent, ReactElement } from 'react'
import { useUserPreferences } from '@context/UserPreferences'
import { removeItemFromArray } from '@utils/index'
import NetworkName from '@shared/NetworkName'
import styles from './NetworkOptions.module.css'

export default function NetworkOptions({
  chainId
}: {
  chainId: number
}): ReactElement {
  const { chainIds, setChainIds } = useUserPreferences()

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
        <NetworkName key={chainId} networkId={chainId} />
      </label>
    </div>
  )
}
