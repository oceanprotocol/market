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
import { useSiteMetadata } from '../../hooks/useSiteMetadata'

export default function Header(): ReactElement {
  const { web3Provider, networkId } = useWeb3()
  const [providerInfo, setProviderInfo] = useState<IProviderInfo>()
  const { config } = useOcean()
  const { warningPolygon, warningPolygonNetwork, warning } = useSiteMetadata()

  const network: NetworkObject = {
    chainId: 137,
    name: 'Matic Network',
    urlList: [
      'https://rpc-mainnet.matic.network',
      'https://rpc-mainnet.maticvigil.com/'
    ]
  }
  const [text, setText] = useState<string>(warning)
  const [action, setAction] = useState<AnnouncementAction>()

  function setBannerForMatic() {
    setText(warningPolygon)
    setAction({
      name: `Add ${config.oceanTokenSymbol}`,
      handleAction: () => addOceanToWallet(config, web3Provider)
    })
  }

  useEffect(() => {
    if (!web3Provider) return
    const providerInfo = getProviderInfo(web3Provider)
    setProviderInfo(providerInfo)
  }, [web3Provider])

  useEffect(() => {
    if (!networkId) return
    networkId === 137 ? setBannerForMatic() : setText(warningPolygonNetwork)
    providerInfo?.name === 'MetaMask' &&
      networkId !== 137 &&
      !window.location.pathname.includes('/asset/did') &&
      setAction({
        name: 'Add custom network',
        handleAction: () => addCustomNetwork(web3Provider, network)
      })
  }, [networkId])

  useEffect(() => {
    if (networkId === 137) return
    window.location.pathname.includes('/asset/did')
      ? setAction(undefined)
      : action
      ? console.log()
      : setAction({
          name: 'Add custom network',
          handleAction: () => addCustomNetwork(web3Provider, network)
        })
  }, [window.location.pathname])

  return (
    <header className={styles.header}>
      <AnnouncementBanner text={text} action={action} />
      <Menu />
    </header>
  )
}
