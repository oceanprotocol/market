import { ConfigHelperConfig } from '@oceanprotocol/lib'
import React, { ReactElement, ChangeEvent } from 'react'
import { useOcean } from '../../../providers/Ocean'
import { useWeb3 } from '../../../providers/Web3'
import { getOceanConfig } from '../../../utils/ocean'
import FormHelp from '../../atoms/Input/Help'
import Label from '../../atoms/Input/Label'
import BoxSelection, { BoxSelectionOption } from '../FormFields/BoxSelection'
import styles from './Chain.module.css'

export default function Chain(): ReactElement {
  const { web3 } = useWeb3()
  const { config, connect } = useOcean()

  async function connectOcean(event: ChangeEvent<HTMLInputElement>) {
    const config = getOceanConfig(event.target.value)
    await connect(config)
  }

  function isNetworkSelected(oceanConfig: string) {
    return (config as ConfigHelperConfig).network === oceanConfig
  }

  const options: BoxSelectionOption[] = [
    {
      name: 'mainnet',
      checked: isNetworkSelected('mainnet'),
      title: 'ETH',
      text: 'Mainnet'
    },
    {
      name: 'polygon',
      checked: isNetworkSelected('polygon'),
      title: 'Polygon/Matic',
      text: 'Mainnet'
    },
    {
      name: 'moonbeamalpha',
      checked: isNetworkSelected('moonbeamalpha'),
      title: 'Moonbase Alpha',
      text: 'Testnet'
    }
  ]

  // TODO: to fully solve https://github.com/oceanprotocol/market/issues/432
  // there are more considerations for users with a wallet connected (wallet network vs. setting network).
  // For now, only show the setting for non-wallet users.
  return !web3 ? (
    <li className={styles.chains}>
      <Label htmlFor="">Chain</Label>
      <BoxSelection
        options={options}
        name="chain"
        handleChange={connectOcean}
      />
      <FormHelp>Switch the data source for the interface.</FormHelp>
    </li>
  ) : null
}
