import { Logger } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
import PriceUnit from '../atoms/Price/PriceUnit'
import axios from 'axios'
import styles from './MarketStats.module.css'
import { useInView } from 'react-intersection-observer'
import {
  EwaiClient,
  IEwaiStatsResult,
  useEwaiInstance
} from '../../ewai/client/ewai-js'
import { useOcean } from '@oceanprotocol/react'

interface MarketStatsResponse {
  datasets: {
    pools: number
    exchanges: number
    none: number
    total: number
  }
  owners: number
  ocean: number
  datatoken: number
}

const refreshInterval = 60000 // 60 sec.

export default function MarketStats(): ReactElement {
  const [ref, inView] = useInView()
  const [stats, setStats] = useState<IEwaiStatsResult>()
  const [networkId, setNetworkId] = useState<number>()
  const [networkName, setNetworkName] = useState<string>()
  const ewaiInstance = useEwaiInstance()
  const { account, ocean, web3 } = useOcean()

  useEffect(() => {
    async function getStats() {
      try {
        const ewaiClient = new EwaiClient({
          username: process.env.EWAI_API_USERNAME,
          password: process.env.EWAI_API_PASSWORD,
          graphQlUrl: process.env.EWAI_API_GRAPHQL_URL
        })
        const ewaiStats = await ewaiClient.ewaiStatsAsync()
        setStats(ewaiStats)
        if (ocean) {
          try {
            const netId = await web3.eth.net.getId() //await (ocean as any).web3?.eth?.net?.getId()

            // next line is a (not typesafe) hack to get into the ocean object data,
            // but it seems to be only way (that works) to get at the data
            // the reason for the simple hack is that I don't want to setup and maintain (yet another)
            // network id to name mapping, when it already exists and is right there in the ocean object
            // see also: https://github.com/ethereum-lists/chains
            const netName = (ocean as any)?.config?.network

            if (netId) {
              setNetworkId(netId)
            }
            if (netName) {
              setNetworkName(netName)
            }
          } catch {}
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          Logger.log(error.message)
        } else {
          Logger.error(error.message)
        }
      }
    }

    // Update periodically when in viewport
    const interval = setInterval(getStats, refreshInterval)

    if (!inView) {
      clearInterval(interval)
    }

    getStats()

    return () => {
      clearInterval(interval)
    }
  }, [inView, account, ocean])

  /* useEffect(() => {
    async function getNetworkId() {
      if (ocean) {
        const netId = await ocean.web3Provider.eth.net.getId()
        setNetworkId(netId)
      }
    }

    // Update periodically when in viewport
    const interval = setInterval(getNetworkId, refreshInterval)

    if (!inView) {
      clearInterval(interval)
    }

    getNetworkId()

    return () => {
      clearInterval(interval)
    }
  }, [networkId]) */

  return (
    <div className={styles.stats} ref={ref}>
      <p>
        There are <strong>{stats?.count}</strong> EWAI energy data sets
        published in this marketplace by <strong>{stats?.addresses}</strong>{' '}
        addresses.
      </p>
      <p>
        <br /> <br />
        Marketplace: {ewaiInstance.name}
        <br />
        EnergyWeb Network: {ewaiInstance.ewcRpcUrl}
        <br />
        EnergyWeb Switchboard: {ewaiInstance.switchboardUrl}
        <br />
        Ocean Network: {networkName || process.env.GATSBY_NETWORK}
        {/* <br />
        Wallet: address={account?.getId() || '{not set}'}, network=
        {networkName ? `${networkName} (${networkId})` : '{not set}'} */}
      </p>
    </div>
  )
}
