import { ConfigHelperConfig } from '@oceanprotocol/lib'
import React, { ReactElement } from 'react'
import { useOcean } from '../../../providers/Ocean'
import { useWeb3 } from '../../../providers/Web3'
import { getOceanConfig } from '../../../utils/ocean'
import Button from '../../atoms/Button'
import FormHelp from '../../atoms/Input/Help'
import Label from '../../atoms/Input/Label'
import styles from './Chain.module.css'

export default function Chain(): ReactElement {
  const { web3 } = useWeb3()
  const { config, connect } = useOcean()

  async function connectOcean(networkName: string) {
    const config = getOceanConfig(networkName)
    await connect(config)
  }

  const chains = [
    { name: 'ETH', oceanConfig: 'mainnet', label: 'Mainnet' },
    { name: 'Polygon/Matic', oceanConfig: 'polygon', label: 'Mainnet' },
    { name: 'Moonbase Alpha', oceanConfig: 'moonbeamalpha', label: 'Testnet' }
  ]

  // TODO: to fully solve https://github.com/oceanprotocol/market/issues/432
  // there are more considerations for users with a wallet connected (wallet network vs. setting network).
  // For now, only show the setting for non-wallet users.
  return !web3 ? (
    <li>
      <Label htmlFor="">Chain</Label>
      <div className={styles.buttons}>
        {chains.map((button) => {
          const selected =
            (config as ConfigHelperConfig).network === button.oceanConfig

          return (
            <Button
              key={button.name}
              className={`${styles.button} ${selected ? styles.selected : ''}`}
              size="small"
              style="text"
              onClick={() => connectOcean(button.oceanConfig)}
            >
              {button.name}
              <span>{button.label}</span>
            </Button>
          )
        })}
      </div>
      <FormHelp>Switch the data source for the interface.</FormHelp>
    </li>
  ) : null
}
