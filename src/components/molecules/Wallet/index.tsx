import React, { ReactElement } from 'react'
import Tooltip from '../../atoms/Tooltip'
import Account from './Account'
import Details from './Details'
import Network from './Network'
import { useWeb3 } from '../../../providers/Web3'
import { wallet } from './index.module.css'

export default function Wallet(): ReactElement {
  const { accountId } = useWeb3()

  return (
    <div className={wallet}>
      <Network />
      <Tooltip
        content={<Details />}
        trigger="click focus"
        disabled={!accountId}
      >
        <Account />
      </Tooltip>
    </div>
  )
}
