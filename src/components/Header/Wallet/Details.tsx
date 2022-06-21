import React, { ReactElement, useEffect, useState } from 'react'
import { formatCurrency } from '@coingecko/cryptoformat'
import { useUserPreferences } from '@context/UserPreferences'
import Button from '@shared/atoms/Button'
import AddToken from '@shared/AddToken'
import Conversion from '@shared/Price/Conversion'
import { useWeb3 } from '@context/Web3'
import { getOceanConfig } from '@utils/ocean'
import styles from './Details.module.css'

export default function Details(): ReactElement {
  const {
    web3ProviderInfo,
    web3Modal,
    connect,
    logout,
    networkData,
    networkId,
    balance
  } = useWeb3()
  const { locale } = useUserPreferences()

  const [mainCurrency, setMainCurrency] = useState<string>()
  const [oceanTokenMetadata, setOceanTokenMetadata] = useState<{
    address: string
    symbol: string
  }>()

  useEffect(() => {
    if (!networkId) return

    const symbol =
      networkId === 2021000 ? 'GX' : networkData?.nativeCurrency.symbol
    setMainCurrency(symbol)

    const oceanConfig = getOceanConfig(networkId)

    oceanConfig &&
      setOceanTokenMetadata({
        address: oceanConfig.oceanTokenAddress,
        symbol: oceanConfig.oceanTokenSymbol
      })
  }, [networkData, networkId])

  return (
    <div className={styles.details}>
      <ul>
        {Object.entries(balance).map(([key, value]) => (
          <li className={styles.balance} key={key}>
            <span className={styles.symbol}>
              {key === 'eth' ? mainCurrency : oceanTokenMetadata?.symbol}
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
            {web3ProviderInfo?.name === 'MetaMask' && (
              <AddToken
                address={oceanTokenMetadata?.address}
                symbol={oceanTokenMetadata?.symbol}
                logo="https://raw.githubusercontent.com/oceanprotocol/art/main/logo/token.png"
                className={styles.addToken}
              />
            )}
          </div>
          <p>
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
    </div>
  )
}
