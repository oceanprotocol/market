import React, { ReactElement, useState } from 'react'
import Menu from '../molecules/Menu'
import styles from './Header.module.css'
import AnnouncementBanner, {
  AnnouncementAction
} from '../molecules/AnnouncementBanner'
import { useWeb3 } from '../../providers/Web3'
import { addCustomNetwork, NetworkObject } from '../../utils/web3'

export default function Header(): ReactElement {
  const { web3Provider } = useWeb3()
  console.log(web3Provider)
  const network: NetworkObject = {
    chainId: 137,
    name: 'Matic Network',
    urlList: [
      'https://rpc-mainnet.matic.network',
      'https://rpc-mainnet.maticvigil.com/'
    ]
  }
  const [text, setText] = useState<string>(
    'Ocean Market is [available on Polygon](https://oceanprotocol.com/technology/marketplaces).'
  )
  const [action, setAction] = useState<AnnouncementAction>({
    name: 'Add custom network',
    handleAction: () => {
      addCustomNetwork(web3Provider, network)
    }
  })
  return (
    <header className={styles.header}>
      <AnnouncementBanner text={text} action={action} />
      <Menu />
    </header>
  )
}
