import React, { ReactElement, useEffect, useState } from 'react'
import Button from '../../atoms/Button'
import styles from './Details.module.css'
import { useOcean } from '@oceanprotocol/react'
import Web3Feedback from './Feedback'
import { getProviderInfo, IProviderInfo } from 'web3modal'
import Conversion from '../../atoms/Price/Conversion'
import { formatCurrency } from '@coingecko/cryptoformat'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { Logger } from '@oceanprotocol/lib'

export default function Details(): ReactElement {
  const {
    balance,
    config,
    connect,
    logout,
    web3Provider,
    networkId
  } = useOcean()
  const { locale } = useUserPreferences()
  const [providerInfo, setProviderInfo] = useState<IProviderInfo>()
  // const [portisNetwork, setPortisNetwork] = useState<string>()

  // Workaround cause getInjectedProviderName() always returns `MetaMask`
  // https://github.com/oceanprotocol/market/issues/332
  useEffect(() => {
    if (!web3Provider) return
    const providerInfo = getProviderInfo(web3Provider)
    setProviderInfo(providerInfo)
  }, [web3Provider])

  async function addOceanToWallet() {
    const tokenMetadata = {
      type: 'ERC20',
      options: {
        address: config.oceanTokenAddress,
        symbol: networkId === 137 ? 'mOCEAN' : 'OCEAN',
        decimals: 18,
        image:
          'https://raw.githubusercontent.com/oceanprotocol/art/main/logo/token.png'
      }
    }
    web3Provider.sendAsync(
      {
        method: 'wallet_watchAsset',
        params: tokenMetadata,
        id: Math.round(Math.random() * 100000)
      },
      (err: string, added: any) => {
        if (err || 'error' in added) {
          Logger.log(
            `Counld't add ${tokenMetadata.options.symbol} (${
              tokenMetadata.options.address
            }) to MetaMask, error: ${err || added.error}`
          )
        } else {
          Logger.log(
            `Added ${tokenMetadata.options.symbol} (${tokenMetadata.options.address}) to MetaMask`
          )
        }
      }
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
            <span className={styles.symbol}>{key.toUpperCase()}</span>{' '}
            {formatCurrency(Number(value), '', locale, false, {
              significantFigures: 4
            })}
            {key === 'ocean' && <Conversion price={value} />}
          </li>
        ))}

        <li className={styles.actions}>
          <span title="Connected provider" className={styles.walletInfo}>
            <div>
              <img className={styles.walletLogo} src={providerInfo?.logo} />
              {providerInfo?.name}
            </div>
            {/* {providerInfo?.name === 'Portis' && (
              <InputElement
                name="network"
                type="select"
                options={['Mainnet', 'Ropsten', 'Rinkeby']}
                size="mini"
                value={portisNetwork}
                onChange={handlePortisNetworkChange}
              />
            )} */}
            {providerInfo?.name === 'MetaMask' && (
              <Button
                style="text"
                size="small"
                onClick={() => {
                  addOceanToWallet()
                }}
              >
                Add Ocean
              </Button>
            )}
          </span>
          <p>
            {providerInfo?.name === 'Portis' && (
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
