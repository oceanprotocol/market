import React, { ReactElement, useEffect, useState } from 'react'
import { formatCurrency } from '@coingecko/cryptoformat'
import { useOcean } from '../../../providers/Ocean'
import { useUserPreferences } from '../../../providers/UserPreferences'
import Button from '../../atoms/Button'
import AddToken from '../../atoms/AddToken'
import Conversion from '../../atoms/Price/Conversion'
import { useWeb3 } from '../../../providers/Web3'

import Web3Feedback from './Feedback'
import styles from './Details.module.css'

export default function Details(): ReactElement {
  const {
    web3Provider,
    web3ProviderInfo,
    web3Modal,
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
            <span className={styles.walletLogoWrap}>
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
              <AddToken
                address={config.oceanTokenAddress}
                symbol={config.oceanTokenSymbol}
                logo="https://raw.githubusercontent.com/oceanprotocol/art/main/logo/token.png"
                className={styles.addToken}
              />
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
              onClick={async () => {
                await web3Modal?.clearCachedProvider()
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
