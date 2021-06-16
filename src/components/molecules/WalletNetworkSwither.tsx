import React, { ReactElement } from 'react'
import { useWeb3 } from '../../providers/Web3'
import { addCustomNetwork, getNetworkConfigObject } from '../../utils/web3'
import Button from '../atoms/Button'
import styles from './WalletNetworkSwitcher.module.css'
import useNetworkMetadata from '../../hooks/useNetworkMetadata'
import NetworkName from '../atoms/NetworkName'
import { useOcean } from '../../providers/Ocean'

export default function WalletNetworkSwitcher(): ReactElement {
  const { networkId, web3Provider } = useWeb3()
  const { networksList } = useNetworkMetadata()
  const { config } = useOcean()

  const ddoNetworkName = <NetworkName networkId={1} textOnly />
  const walletNetworkName = <NetworkName networkId={networkId} textOnly />

  async function switchWalletNetwork() {
    const networkNode = networksList.find(
      (data) => data.node.chainId === 1
    ).node
    console.log(networkNode)
    const network = { ...networkNode, providerUri: config.providerUri }
    console.log(network)
    // const networkConfig = getNetworkConfigObject(networkNode)
    // console.log(networkConfig)
    addCustomNetwork(web3Provider, {
      name: networkNode.chain,
      symbol: networkNode.nativeCurrency.symbol,
      chainId: networkNode.chainId,
      urlList: [config.providerUri]
    })
  }

  return (
    <div className={styles.content}>
      <img
        src="https://raw.githubusercontent.com/oceanprotocol/art/main/logo/datatoken.png"
        className={styles.image}
      />
      <div>
        <h3 className={styles.title}>
          You are watching OCEAN on {ddoNetworkName} but your wallet is
          connected to {walletNetworkName}
        </h3>
        <Button
          style="primary"
          size="small"
          onClick={() => switchWalletNetwork()}
          className={styles.toggle}
        >
          Switch to {ddoNetworkName}
        </Button>
      </div>
    </div>
  )
}
