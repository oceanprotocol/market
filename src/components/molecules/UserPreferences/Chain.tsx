import { ConfigHelperConfig } from '@oceanprotocol/lib'
import React, { ReactElement, ChangeEvent } from 'react'
import { useOcean } from '../../../providers/Ocean'
import { getOceanConfig } from '../../../utils/ocean'
import FormHelp from '../../atoms/Input/Help'
import Label from '../../atoms/Input/Label'
import BoxSelection, { BoxSelectionOption } from '../FormFields/BoxSelection'
import { ReactComponent as EthIcon } from '../../../images/eth.svg'
import { ReactComponent as PolygonIcon } from '../../../images/polygon.svg'
import { ReactComponent as MoonbeamIcon } from '../../../images/moonbeam.svg'
import styles from './Chain.module.css'

export default function Chain(): ReactElement {
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
      text: 'Mainnet',
      icon: <EthIcon />
    },
    {
      name: 'polygon',
      checked: isNetworkSelected('polygon'),
      title: 'Polygon',
      text: 'Mainnet',
      icon: <PolygonIcon />
    },
    {
      name: 'moonbeamalpha',
      checked: isNetworkSelected('moonbeamalpha'),
      title: 'Moonbase Alpha',
      text: 'Testnet',
      icon: <MoonbeamIcon />
    }
  ]

  return (
    <li className={styles.chains}>
      <Label htmlFor="">Chain</Label>
      <BoxSelection
        options={options}
        name="chain"
        handleChange={connectOcean}
      />
      <FormHelp>Switch the data source for the interface.</FormHelp>
    </li>
  )
}
