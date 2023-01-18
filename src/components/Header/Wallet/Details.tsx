import React, { ReactElement, useEffect, useState } from 'react'
import { formatCurrency } from '@coingecko/cryptoformat'
import { useUserPreferences } from '@context/UserPreferences'
import Button from '@shared/atoms/Button'
import AddToken from '@shared/AddToken'
import Conversion from '@shared/Price/Conversion'
import { getOceanConfig } from '@utils/ocean'
import { useNetwork, useProvider, useDisconnect, useAccount } from 'wagmi'
import styles from './Details.module.css'
import { useWeb3 } from '@context/Web3'
import { useWeb3Modal } from '@web3modal/react'
import useNetworkMetadata from '@hooks/useNetworkMetadata'

export default function Details(): ReactElement {
  const { chain } = useNetwork()
  const { connector: activeConnector, isConnected } = useAccount()
  const { open: openWeb3Modal } = useWeb3Modal()
  const { disconnect } = useDisconnect()
  const provider = useProvider()
  const { balance } = useWeb3()
  const { networkData } = useNetworkMetadata()
  const { locale } = useUserPreferences()

  const [mainCurrency, setMainCurrency] = useState<string>()
  const [oceanTokenMetadata, setOceanTokenMetadata] = useState<{
    address: string
    symbol: string
  }>()

  useEffect(() => {
    if (!chain?.id) return

    const symbol = networkData?.nativeCurrency.symbol
    setMainCurrency(symbol)

    const oceanConfig = getOceanConfig(chain.id)

    oceanConfig &&
      setOceanTokenMetadata({
        address: oceanConfig.oceanTokenAddress,
        symbol: oceanConfig.oceanTokenSymbol
      })
  }, [networkData, chain?.id])

  return (
    <div className={styles.details}>
      <ul>
        {Object.entries(balance).map(([key, value]) => (
          <li className={styles.balance} key={key}>
            <span className={styles.symbol}>
              {key === 'eth' ? mainCurrency : key.toUpperCase()}
            </span>
            <span className={styles.value}>
              {formatCurrency(Number(value), '', locale, false, {
                significantFigures: 4
              })}
            </span>
            <Conversion
              className={styles.conversion}
              price={Number(value)}
              symbol={key}
            />
          </li>
        ))}

        <li className={styles.actions}>
          <div title="Connected provider" className={styles.walletInfo}>
            <span className={styles.walletLogoWrap}>
              {/* <img className={styles.walletLogo} src={activeConnector?.logo} /> */}
              {activeConnector?.name}
            </span>
            {activeConnector?.name === 'MetaMask' && (
              <AddToken
                address={oceanTokenMetadata?.address}
                symbol={oceanTokenMetadata?.symbol}
                className={styles.addToken}
              />
            )}
          </div>
          <p>
            <Button style="text" size="small" onClick={() => openWeb3Modal()}>
              Switch Wallet
            </Button>
            <Button
              style="text"
              size="small"
              onClick={() => {
                disconnect()
                location.reload()
              }}
            >
              Disconnect
            </Button>
          </p>
        </li>
      </ul>
    </div>
  )
}
