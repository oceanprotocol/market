import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { OperationContext } from 'urql'
import Tooltip from '@shared/atoms/Tooltip'
import { fetchData, getSubgraphUri } from '@utils/subgraph'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import useNetworkMetadata, {
  filterNetworksByType
} from '@hooks/useNetworkMetadata'
import { LoggerInstance } from '@oceanprotocol/lib'
import styles from './index.module.css'
import { FooterStatsValues_globalStatistics as FooterStatsValuesGlobalStatistics } from 'src/@types/subgraph/FooterStatsValues'
import MarketStatsTooltip from './Tooltip'
import MarketStatsTotal from './Total'
import { queryGlobalStatistics } from './_queries'
import { usePrices } from '@context/Prices'
import { useUserPreferences } from '@context/UserPreferences'
import Decimal from 'decimal.js'
import { StatsTotal, StatsValue } from './_types'

const initialTotal: StatsTotal = {
  totalValueLockedInOcean: 0,
  totalOceanLiquidity: 0,
  pools: 0,
  nfts: 0,
  datatokens: 0,
  orders: 0
}

export default function MarketStats(): ReactElement {
  const { appConfig } = useSiteMetadata()
  const { networksList } = useNetworkMetadata()
  const { currency } = useUserPreferences()
  const { prices } = usePrices()

  const [mainChainIds, setMainChainIds] = useState<number[]>()
  const [data, setData] =
    useState<{ [chainId: number]: FooterStatsValuesGlobalStatistics }>()
  const [totalValueLockedInOcean, setTotalValueLockedInOcean] =
    useState<StatsValue>()
  const [totalOceanLiquidity, setTotalOceanLiquidity] = useState<StatsValue>()
  const [poolCount, setPoolCount] = useState<StatsValue>()
  const [total, setTotal] = useState(initialTotal)

  //
  // Set the main chain ids we want to display stats for
  //
  useEffect(() => {
    if (!networksList) return

    const mainChainIdsList = filterNetworksByType(
      'mainnet',
      appConfig.chainIdsSupported,
      networksList
    )
    setMainChainIds(mainChainIdsList)
  }, [appConfig.chainIdsSupported, networksList])

  //
  // Helper: fetch data from subgraph
  //
  const getMarketStats = useCallback(async () => {
    if (!mainChainIds?.length) return

    for (const chainId of mainChainIds) {
      const context: OperationContext = {
        url: `${getSubgraphUri(
          chainId
        )}/subgraphs/name/oceanprotocol/ocean-subgraph`,
        requestPolicy: 'network-only'
      }

      try {
        const response = await fetchData(queryGlobalStatistics, null, context)
        if (!response?.data?.globalStatistics) return

        setData((prevState) => ({
          ...prevState,
          [chainId]: response.data.globalStatistics[0]
        }))
      } catch (error) {
        LoggerInstance.error('Error fetching global stats: ', error.message)
      }
    }
  }, [mainChainIds])

  //
  // 1. Fetch Data
  //
  useEffect(() => {
    getMarketStats()
  }, [getMarketStats])

  //
  // 2. Data Manipulation
  //
  useEffect(() => {
    if (!data || !mainChainIds?.length) return

    const newTotal: StatsTotal = {
      ...initialTotal // always start calculating beginning from initial 0 values
    }

    for (const chainId of mainChainIds) {
      const baseTokenValue = data[chainId]?.totalLiquidity[0]?.value

      try {
        const totalValueLockedInOcean = baseTokenValue
          ? new Decimal(baseTokenValue).mul(2)
          : new Decimal(0)

        setTotalValueLockedInOcean((prevState) => ({
          ...prevState,
          [chainId]: `${totalValueLockedInOcean}`
        }))

        const totalOceanLiquidity = Number(baseTokenValue) || 0

        setTotalOceanLiquidity((prevState) => ({
          ...prevState,
          [chainId]: `${totalOceanLiquidity}`
        }))

        const poolCount = data[chainId]?.poolCount || 0

        setPoolCount((prevState) => ({
          ...prevState,
          [chainId]: `${poolCount}`
        }))

        const nftCount = data[chainId]?.nftCount || 0
        const datatokenCount = data[chainId]?.datatokenCount || 0
        const orderCount = data[chainId]?.orderCount || 0

        newTotal.totalValueLockedInOcean += totalValueLockedInOcean.toNumber()
        newTotal.totalOceanLiquidity += totalOceanLiquidity
        newTotal.pools += poolCount
        newTotal.nfts += nftCount
        newTotal.datatokens += datatokenCount
        newTotal.orders += orderCount
      } catch (error) {
        LoggerInstance.error('Error data manipulation: ', error.message)
      }
    }

    setTotal(newTotal)
  }, [data, mainChainIds, prices, currency])

  return (
    <div className={styles.stats}>
      <>
        <MarketStatsTotal total={total} />{' '}
        <Tooltip
          className={styles.info}
          content={
            <MarketStatsTooltip
              totalValueLockedInOcean={totalValueLockedInOcean}
              poolCount={poolCount}
              totalOceanLiquidity={totalOceanLiquidity}
              mainChainIds={mainChainIds}
            />
          }
        />
      </>
    </div>
  )
}
