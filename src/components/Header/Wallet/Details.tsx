import { ReactElement, useEffect, useState } from 'react'
import { formatCurrency } from '@coingecko/cryptoformat'
import { useUserPreferences } from '@context/UserPreferences'
import Button from '@shared/atoms/Button'
import AddToken from '@shared/AddToken'
import { useOrbis } from '@context/DirectMessages'
import { getOceanConfig } from '@utils/ocean'
import { useDisconnect } from 'wagmi'
import styles from './Details.module.css'
import useBalance from '@hooks/useBalance'
import useNetworkMetadata from '@hooks/useNetworkMetadata'
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetworkCore
} from '@reown/appkit/react'

export default function Details(): ReactElement {
  const { chainId } = useAppKitNetworkCore()
  const { address: accountId } = useAppKitAccount()
  const { open } = useAppKit()
  const { disconnect } = useDisconnect()
  const { balance } = useBalance()
  const { networkData } = useNetworkMetadata()
  const { locale } = useUserPreferences()
  const { checkOrbisConnection, disconnectOrbis } = useOrbis()
  const connector = 'metaMask'

  const [mainCurrency, setMainCurrency] = useState<string>()
  const [oceanTokenMetadata, setOceanTokenMetadata] = useState<{
    address: string
    symbol: string
  }>()

  useEffect(() => {
    if (!chainId) return

    const symbol = networkData?.nativeCurrency.symbol
    setMainCurrency(symbol)

    const oceanConfig = getOceanConfig(chainId)

    oceanConfig &&
      setOceanTokenMetadata({
        address: oceanConfig.oceanTokenAddress,
        symbol: oceanConfig.oceanTokenSymbol
      })
  }, [networkData, chainId])

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
            {/* <Conversion
              className={styles.conversion}
              price={Number(value)}
              symbol={key}
            /> */}
          </li>
        ))}

        <li className={styles.actions}>
          <div title="Connected provider" className={styles.walletInfo}>
            <span className={styles.walletLogoWrap}>
              {/* <img className={styles.walletLogo} src={activeConnector?.logo} /> */}
              {connector}
            </span>
            {connector === 'metaMask' && (
              <AddToken
                address={oceanTokenMetadata?.address}
                symbol={oceanTokenMetadata?.symbol}
                className={styles.addToken}
              />
            )}
          </div>
          <p>
            <Button
              style="text"
              size="small"
              onClick={async () => {
                open()
                checkOrbisConnection({ address: accountId })
              }}
            >
              Switch Wallet
            </Button>
            <Button
              style="text"
              size="small"
              onClick={() => {
                disconnect()
                disconnectOrbis(accountId)
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
