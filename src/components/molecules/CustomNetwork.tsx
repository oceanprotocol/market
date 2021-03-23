import { Logger } from '@oceanprotocol/lib'
import Button from '../atoms/Button'
import React, { ReactElement } from 'react'
import styles from './CustomNetwork.module.css'
import { useWeb3 } from '../../providers/Web3'

export default function CustomNetwork(): ReactElement {
  const { web3Provider } = useWeb3()
  const network = {
    chainId: 137,
    name: 'Matic Network'
  }

  function addCustomNetwork() {
    const newNewtworkData = {
      chainId: `0x${network.chainId.toString(16)}`,
      rpcUrls: [
        'https://rpc-mainnet.matic.network',
        'https://rpc-mainnet.maticvigil.com/'
      ]
    }
    web3Provider.request(
      {
        method: 'wallet_addEthereumChain',
        params: [newNewtworkData]
      },
      (err: string, added: any) => {
        if (err || 'error' in added) {
          Logger.error(
            `Couldn't add ${network.name} (0x${
              network.chainId
            }) netowrk to MetaMask, error: ${err || added.error}`
          )
        } else {
          Logger.log(
            `Added ${network.name} (0x${network.chainId}) network to MetaMask`
          )
        }
      }
    )
  }

  return (
    <div className={styles.wrapper}>
      <span>{`${network.name} is availible in ocean market`}</span>
      <Button style="primary" onClick={() => addCustomNetwork()}>
        {`Switch to ${network.name}`}
      </Button>
    </div>
  )
}
