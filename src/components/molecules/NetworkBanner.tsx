import React, { ReactElement, useEffect, useState } from 'react'
import { useWeb3 } from '../../providers/Web3'
import { addCustomNetwork, NetworkObject } from '../../utils/web3'
import { getOceanConfig } from '../../utils/ocean'
import { useOcean } from '../../providers/Ocean'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import AnnouncementBanner, {
  AnnouncementAction
} from '../atoms/AnnouncementBanner'

const networkMatic: NetworkObject = {
  chainId: 137,
  name: 'Matic Network',
  urlList: [
    'https://rpc-mainnet.matic.network',
    'https://rpc-mainnet.maticvigil.com/'
  ]
}

export default function NetworkBanner(): ReactElement {
  const { web3Provider, web3ProviderInfo } = useWeb3()
  const { config, connect } = useOcean()
  const { announcement } = useSiteMetadata()

  const [text, setText] = useState<string>(announcement.main)
  const [action, setAction] = useState<AnnouncementAction>()

  const addCustomNetworkAction = {
    name: 'Add custom network',
    handleAction: () => addCustomNetwork(web3Provider, networkMatic)
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
    if (!web3ProviderInfo || (!web3Provider && !config)) return

    switch (web3ProviderInfo.name) {
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
        if (config.networkId === 137) {
          setBannerForMatic()
        } else {
          setText(announcement.main)
          setAction(addCustomNetworkAction)
        }
        break
      default:
        if (config.networkId === 137) {
          setBannerForMatic()
        } else {
          setText(announcement.main)
          setAction(undefined)
        }
    }
  }, [web3Provider, web3ProviderInfo, config, announcement])

  return <AnnouncementBanner text={text} action={action} />
}
