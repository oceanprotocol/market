import React, { ReactElement, useEffect, useState } from 'react'
import styles from './AnnouncementBanner.module.css'
import Markdown from '../atoms/Markdown'
import { useWeb3 } from '../../providers/Web3'
import { addCustomNetwork, NetworkObject } from '../../utils/web3'
import { getOceanConfig } from '../../utils/ocean'
import { getProviderInfo } from 'web3modal'
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
    setAction(undefined)
  }

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
          setAction(addCustomNetworkAction)
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
