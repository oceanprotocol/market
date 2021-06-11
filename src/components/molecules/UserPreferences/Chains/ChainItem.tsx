import React, { ChangeEvent, ReactElement } from 'react'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import { removeItemFromArray } from '../../../../utils'
import NetworkName from '../../../atoms/NetworkName'
import styles from './ChainItem.module.css'

export function ChainItem({ chainId }: { chainId: number }): ReactElement {
  const { chainIds, setChainIds } = useUserPreferences()

  function handleChainChanged(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target

    // storing all chainId everywhere as a number so convert from here
    const valueAsNumber = Number(value)

    const newChainIds = chainIds.includes(valueAsNumber)
      ? [...removeItemFromArray(chainIds, valueAsNumber)]
      : [...chainIds, valueAsNumber]
    setChainIds(newChainIds)
  }

  return (
    <div className={styles.radioWrap} key={chainId}>
      <label className={styles.radioLabel} htmlFor={`opt-${chainId}`}>
        <input
          className={styles.input}
          id={`opt-${chainId}`}
          type="checkbox"
          name="chainIds"
          value={chainId}
          onChange={handleChainChanged}
          defaultChecked={chainIds.includes(chainId)}
        />
        <NetworkName key={chainId} networkId={chainId} />
      </label>
    </div>
  )
}
