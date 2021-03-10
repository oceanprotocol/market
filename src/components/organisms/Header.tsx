import React, { ReactElement } from 'react'
import { useOcean } from '../../providers/Ocean'
import { getOceanConfig } from '../../providers/Ocean/utils'
import Menu from '../molecules/Menu'
import styles from './Header.module.css'

export default function Header(): ReactElement {
  const { connect } = useOcean()

  // PROTOTYPE
  // to see if #432 can be solved with the changes
  // https://github.com/oceanprotocol/market/issues/432
  async function handleEthMain() {
    const config = getOceanConfig('mainnet')
    await connect(config)
  }

  async function handleEthRinkeby() {
    const config = getOceanConfig('rinkeby')
    await connect(config)
  }

  async function handleMatic() {
    const config = getOceanConfig('polygon')
    await connect(config)
  }

  return (
    <header className={styles.header}>
      <Menu />
      <button onClick={handleEthMain}>ETH Mainnet</button>{' '}
      <button onClick={handleEthRinkeby}>ETH Rinkeby</button>
      <button onClick={handleMatic}>Matic</button>
    </header>
  )
}
