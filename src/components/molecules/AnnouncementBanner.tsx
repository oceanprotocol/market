import React, { ReactElement, useEffect, useState } from 'react'
import styles from './AnnouncementBanner.module.css'
import Markdown from '../atoms/Markdown'
import { useWeb3 } from '../../providers/Web3'
import {
  addCustomNetwork,
  addOceanToWallet,
  NetworkObject
} from '../../utils/web3'
import { getOceanConfig } from '../../utils/ocean'
import { getProviderInfo, IProviderInfo } from 'web3modal'
import { useOcean } from '../../providers/Ocean'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import Button from '../atoms/Button'

export interface AnnouncementAction {
  name: string
  style?: string
  handleAction: () => void
}

export default function AnnouncementBanner(): ReactElement {
  const { web3Provider, networkId } = useWeb3()
  // const [providerInfo, setProviderInfo] = useState<IProviderInfo>()
  const { config, connect } = useOcean()
  const { announcement } = useSiteMetadata()

  const network: NetworkObject = {
    chainId: 137,
    name: 'Matic Network',
    urlList: [
      'https://rpc-mainnet.matic.network',
      'https://rpc-mainnet.maticvigil.com/'
    ]
  }
  const [text, setText] = useState<string>(announcement.main)
  const [action, setAction] = useState<AnnouncementAction>()
  const addCustomNetworkAction = {
    name: 'Add custom network',
    handleAction: () => addCustomNetwork(web3Provider, network)
  }
  const addCustomTokenAction = {
    name: `Add ${config.oceanTokenSymbol}`,
    handleAction: () => addOceanToWallet(config, web3Provider)
  }
  const switchToPolygonAction = {
    name: 'Switch to Polygon',
    handleAction: async () => {
      const config = getOceanConfig('polygon')
      await connect(config)
    }
  }
  const switchToEthAction = {
    name: 'Switch to ETH',
    handleAction: async () => {
      const config = getOceanConfig('mainnet')
      await connect(config)
    }
  }

  function setBannerForMatic() {
    setText(announcement.polygon)
    setAction(addCustomTokenAction)
  }

  /* useEffect(() => {
    if (!web3Provider && config.networkId) {
      if (config.networkId !== 137) {
        setText(announcement.main)
        setAction(switchToPolygonAction)
      } else {
        setText(announcement.polygon)
        setAction(switchToEthAction)
      }
      return
    }
    const providerInfo = getProviderInfo(web3Provider)
    setProviderInfo(providerInfo)
  }, [web3Provider, config])

  useEffect(() => {
    if (!networkId || providerInfo?.name !== 'MetaMask' || !web3Provider) return
    if (networkId === 137) {
      setBannerForMatic()
      return
    }
    setText(announcement.main)
    !window.location.pathname.includes('/asset/did') &&
      setAction(addCustomNetworkAction)
  }, [config]) */

  useEffect(() => {
    if (!web3Provider && !config) return
    const providerInfo = getProviderInfo(web3Provider)
    switch (providerInfo?.name) {
      case 'Web3':
        if (config.networkId !== 137) {
          setText(announcement.main)
          setAction(switchToPolygonAction)
        } else {
          setText(announcement.polygon)
          setAction(switchToEthAction)
        }
        break
      case 'MetaMask':
        if (networkId === 137) {
          setBannerForMatic()
        } else {
          setText(announcement.main)
          window.location.pathname.includes('/asset/did')
            ? setAction(undefined)
            : setAction(addCustomNetworkAction)
        }
        break
      default:
        if (networkId === 137) {
          setBannerForMatic()
        } else {
          setText(announcement.main)
          setAction(undefined)
        }
    }
  }, [web3Provider, config])

  useEffect(() => {
    if (networkId === 137 || !web3Provider) return
    window.location.pathname.includes('/asset/did')
      ? setAction(undefined)
      : !action && setAction(addCustomNetworkAction)
  }, [window.location.pathname])

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        {text && <Markdown className={styles.text} text={text} />}
        {action && (
          <Button style="text" size="small" onClick={action.handleAction}>
            {action.name}
          </Button>
        )}
      </div>
    </div>
  )
}
