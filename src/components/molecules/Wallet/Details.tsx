import React, { ReactElement, useEffect, useState } from 'react'
import Button from '../../atoms/Button'
import styles from './Details.module.css'
import { useOcean } from '../../../providers/Ocean'
import Web3Feedback from './Feedback'
import Conversion from '../../atoms/Price/Conversion'
import { formatCurrency } from '@coingecko/cryptoformat'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { useWeb3 } from '../../../providers/Web3'
import { addTokenToWallet } from '../../../utils/web3'

export default function Details(): ReactElement {
  const {
    web3Provider,
    web3ProviderInfo,
    connect,
    logout,
    networkData
  } = useWeb3()
  const { balance, config } = useOcean()
  const { locale } = useUserPreferences()

  const [mainCurrency, setMainCurrency] = useState<string>()
  // const [portisNetwork, setPortisNetwork] = useState<string>()

  useEffect(() => {
    if (!networkData) return

    setMainCurrency(networkData.nativeCurrency.symbol)
  }, [networkData])

  async function handleAddToken() {
    await addTokenToWallet(
      web3Provider,
      config.oceanTokenAddress,
      config.oceanTokenSymbol
    )
  }

  // Handle network change for Portis
  // async function handlePortisNetworkChange(e: ChangeEvent<HTMLSelectElement>) {
  //   setPortisNetwork(e.target.value)
  //   const portisNetworkName = e.target.value.toLowerCase()
  //   await web3Provider._portis.changeNetwork(portisNetworkName)
  //   // TODO: using our connect initializes a new Portis instance,
  //   // which then defaults back to initial network (Mainnet).
  //   // await connect()
  // }

  return (
    <div className={styles.details}>
      <ul>
        {Object.entries(balance).map(([key, value]) => (
          <li className={styles.balance} key={key}>
            <span className={styles.symbol}>
              {key === 'eth' ? mainCurrency : config.oceanTokenSymbol}
            </span>{' '}
            {formatCurrency(Number(value), '', locale, false, {
              significantFigures: 4
            })}
            {key === 'ocean' && <Conversion price={value} />}
          </li>
        ))}

        <li className={styles.actions}>
          <div title="Connected provider" className={styles.walletInfo}>
            <span>
              <img className={styles.walletLogo} src={web3ProviderInfo?.logo} />
              {web3ProviderInfo?.name}
            </span>
            {/* {web3ProviderInfo?.name === 'Portis' && (
              <InputElement
                name="network"
                type="select"
                options={['Mainnet', 'Ropsten', 'Rinkeby']}
                size="mini"
                value={portisNetwork}
                onChange={handlePortisNetworkChange}
              />
            )} */}
            {web3ProviderInfo?.name === 'MetaMask' && (
              <Button style="text" size="small" onClick={handleAddToken}>
                {`Add ${config.oceanTokenSymbol}`}
              </Button>
            )}
          </div>
          <p>
            {web3ProviderInfo?.name === 'Portis' && (
              <Button
                style="text"
                size="small"
                onClick={() => web3Provider._portis.showPortis()}
              >
                Show Portis
              </Button>
            )}
            <Button
              style="text"
              size="small"
              onClick={() => {
                logout()
                connect()
              }}
            >
              Switch Wallet
            </Button>
            <Button
              style="text"
              size="small"
              onClick={() => {
                logout()
                location.reload()
              }}
            >
              Disconnect
            </Button>
          </p>
        </li>
      </ul>
      <Web3Feedback />
    </div>
  )
}
