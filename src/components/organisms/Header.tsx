import React, { ReactElement, useEffect, useState } from 'react'
import Menu from '../molecules/Menu'
import styles from './Header.module.css'
import AnnouncementBanner, {
  AnnouncementAction
} from '../molecules/AnnouncementBanner'
import { useWeb3 } from '../../providers/Web3'
import {
  addCustomNetwork,
  addOceanToWallet,
  NetworkObject
} from '../../utils/web3'
import { getProviderInfo, IProviderInfo } from 'web3modal'
import { useOcean } from '../../providers/Ocean'

export default function Header(): ReactElement {
  const { web3Provider, networkId } = useWeb3()
  const [providerInfo, setProviderInfo] = useState<IProviderInfo>()
  const { config } = useOcean

  const network: NetworkObject = {
    chainId: 137,
    name: 'Matic Network',
    urlList: [
      'https://rpc-mainnet.matic.network',
      'https://rpc-mainnet.maticvigil.com/'
    ]
  }
  const [text, setText] = useState<string>()
  const [action, setAction] = useState<AnnouncementAction>()

  useEffect(() => {
    if (!web3Provider) return
    console.log(web3Provider)
    const providerInfo = getProviderInfo(web3Provider)
    setProviderInfo(providerInfo)
  }, [web3Provider])

  function setBannerForMatic() {
    setText('Polygon/Matic EVM support is in early stages.')
    setAction({
      name: 'Add MOcean',
      handleAction: () => addOceanToWallet(config, web3Provider)
    })
  }

  useEffect(() => {
    console.log(networkId)
    networkId === 137
      ? setBannerForMatic()
      : setText(
          'Ocean Market is [available on Polygon](https://oceanprotocol.com/technology/marketplaces).'
        )
    providerInfo?.name === 'MetaMask' &&
      networkId !== 137 &&
      setAction({
        name: 'Add custom network',
        handleAction: () => addCustomNetwork(web3Provider, network)
      })
  }, [networkId])

  return (
    <header className={styles.header}>
      <AnnouncementBanner text={text} action={action} />
      <Menu />
    </header>
  )
}
