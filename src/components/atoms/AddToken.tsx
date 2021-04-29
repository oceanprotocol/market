import React, { ReactElement } from 'react'
import { DDO } from '@oceanprotocol/lib'
import Button from '../atoms/Button'
import { addDatatokenToWallet } from '../../utils/web3'
import { useOcean } from '../../providers/Ocean'
import { useWeb3 } from '../../providers/Web3'

// const cx = classNames.bind(styles)

export default function AddToken({ ddo }: { ddo: DDO }): ReactElement {
  const { web3Provider } = useWeb3()
  const { config } = useOcean()
  console.log('Add token')

  return (
    <div>
      <Button
        style="text"
        size="small"
        onClick={() => {
          addDatatokenToWallet(config, web3Provider)
        }}
      >
        {`Add ${ddo.dataTokenInfo.symbol} to wallet`}
      </Button>
    </div>
  )
}
