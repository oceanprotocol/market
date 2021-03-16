import React, { ReactElement, useState } from 'react'
import Account from './Account'
import Details from './Details'
import Tooltip from '../../atoms/Tooltip'
import Network from './Network'
import { useOcean } from '@oceanprotocol/react'
import styles from './index.module.css'

export default function Wallet(): ReactElement {
  const { accountId } = useOcean()
  const [networkName, setNetworkName] = useState<string>()

  return (
    <div className={styles.wallet}>
      <Network networkName={networkName} setNetworkName={setNetworkName} />
      <Tooltip
        content={<Details networkName={networkName} />}
        trigger="click focus"
        disabled={!accountId}
      >
        <Account />
      </Tooltip>
    </div>
  )
}
