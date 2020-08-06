import React, { ReactElement } from 'react'
import Account from './Account'
import Details from './Details'
import Tooltip from '../../atoms/Tooltip'
import { useOcean } from '@oceanprotocol/react'

export default function Wallet(): ReactElement {
  const { accountId } = useOcean()

  return (
    <Tooltip content={<Details />} trigger="click focus" disabled={!accountId}>
      <Account />
    </Tooltip>
  )
}
