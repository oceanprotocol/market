import React, { ReactElement, useEffect, useState } from 'react'
import Button from '../../atoms/Button'
import styles from './Details.module.css'
import { useOcean } from '../../../providers/Ocean'
import Web3Feedback from './Feedback'
import { getProviderInfo, IProviderInfo } from 'web3modal'
import Conversion from '../../atoms/Price/Conversion'
import { formatCurrency } from '@coingecko/cryptoformat'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { useWeb3 } from '../../../providers/Web3'
import { EthereumListsChain, getNetworkData } from '../../../utils/web3'
import { graphql, useStaticQuery } from 'gatsby'

const currencyQuery = graphql`
  query CurrencyQuery {
    allNetworksMetadataJson {
      edges {
        node {
          networkId
          nativeCurrency {
            name
            symbol
          }
        }
      }
    }
  }
`

export default function Details(): ReactElement {
  const data = useStaticQuery(currencyQuery)
  const networksList: { node: EthereumListsChain }[] =
    data.allNetworksMetadataJson.edges

  const { web3Provider, connect, logout, networkId } = useWeb3()
  const { balance } = useOcean()
  const { locale } = useUserPreferences()
  const [providerInfo, setProviderInfo] = useState<IProviderInfo>()
  const [mainCurrency, setMainCurrency] = useState<string>()
  // const [portisNetwork, setPortisNetwork] = useState<string>()

  // Workaround cause getInjectedProviderName() always returns `MetaMask`
  // https://github.com/oceanprotocol/market/issues/332
  useEffect(() => {
    if (!web3Provider) return
    const providerInfo = getProviderInfo(web3Provider)
    setProviderInfo(providerInfo)
  }, [web3Provider])

  useEffect(() => {
    if (!networkId) return
    // Figure out if we're on a chain's testnet, or not
    const networkData = getNetworkData(networksList, networkId)
    setMainCurrency(networkData.nativeCurrency.symbol)
  }, [networkId, networksList])

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
              {key === 'eth' ? mainCurrency : key.toUpperCase()}
            </span>{' '}
            {formatCurrency(Number(value), '', locale, false, {
              significantFigures: 4
            })}
            {key === 'ocean' && <Conversion price={value} />}
          </li>
        ))}

        <li className={styles.actions}>
          <span title="Connected provider">
            <img className={styles.walletLogo} src={providerInfo?.logo} />
            {providerInfo?.name}
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
