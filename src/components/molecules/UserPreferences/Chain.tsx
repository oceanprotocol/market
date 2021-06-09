import React, { ChangeEvent, ReactElement } from 'react'
import Label from '../../atoms/Input/Label'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'
import NetworkName from '../../atoms/NetworkName'
import { removeItemFromArray } from '../../../utils'
import FormHelp from '../../atoms/Input/Help'
import styles from './Chain.module.css'

export default function Chain(): ReactElement {
  const { appConfig } = useSiteMetadata()
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
    <li>
      <Label htmlFor="chains">Chains</Label>
      <div className={styles.chains}>
        {appConfig.chainIdsSupported.map((chainId) => (
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
        ))}
      </div>

      <FormHelp>Switch the data source for the interface.</FormHelp>
    </li>
  )
}
