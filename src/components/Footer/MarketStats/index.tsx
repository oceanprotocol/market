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
import {
  FooterStatsValues_globalStatistics as FooterStatsValuesGlobalStatistics,
  FooterStatsValues
} from 'src/@types/subgraph/FooterStatsValues'
import MarketStatsTooltip from './Tooltip'
import MarketStatsTotal from './Total'
import { queryGlobalStatistics } from './_queries'
import { usePrices } from '@context/Prices'
import { useUserPreferences } from '@context/UserPreferences'
import Decimal from 'decimal.js'

export interface StatsValue {
  [chainId: number]: string
}

export default function MarketStats(): ReactElement {
  const { currency } = useUserPreferences()
  const { prices } = usePrices()

  const [data, setData] =
    useState<{ [chainId: number]: FooterStatsValuesGlobalStatistics }>()
  const [totalValueLocked, setTotalValueLocked] = useState<StatsValue>()
  const [totalOceanLiquidity, setTotalOceanLiquidity] = useState<StatsValue>()
  const [poolCount, setPoolCount] = useState<StatsValue>()
  const [totalValueLockedSum, setTotalValueLockedSum] = useState<string>()
  const [totalOceanLiquiditySum, setTotalOceanLiquiditySum] = useState<string>()
  const [poolCountSum, setPoolCountSum] = useState<string>()
  const [mainChainIds, setMainChainIds] = useState<number[]>()
  const { appConfig } = useSiteMetadata()
  const { networksList } = useNetworkMetadata()

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

        setData((prevState) => ({
          ...prevState,
          [chainId]: response?.data?.globalStatistics[0]
        }))
      } catch (error) {
        LoggerInstance.error('Error fetchData: ', error.message)
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

    let newTotalValueLockedSum = 0
    const newTotalOceanLiquiditySum = 0
    let newPoolCountSum = 0

    for (const chainId of mainChainIds) {
      const { totalLiquidity, poolCount } = data[chainId]
      const conversionSpotPrice = prices[currency.toLowerCase()]
      const totalValueLocked = new Decimal(totalLiquidity[0].value)
        .mul(conversionSpotPrice)
        .toString()

      setTotalValueLocked((prevState) => ({
        ...prevState,
        [chainId]: totalValueLocked
      }))
      // TODO: how to get total OCEAN liquidity?
      setTotalOceanLiquidity((prevState) => ({
        ...prevState,
        [chainId]: totalLiquidity[0].value
      }))
      setPoolCount((prevState) => ({
        ...prevState,
        [chainId]: `${poolCount}`
      }))

      newTotalValueLockedSum += parseInt(totalLiquidity[0].value)
      // newTotalOceanLiquiditySum += parseInt(totalOceanLiquidity.value)
      newPoolCountSum += poolCount
    }

    setTotalValueLockedSum(`${newTotalValueLockedSum}`)
    setTotalOceanLiquiditySum(`${newTotalOceanLiquiditySum}`)
    setPoolCountSum(`${newPoolCountSum}`)
  }, [data, mainChainIds, prices, currency])

  return (
    <div className={styles.stats}>
      <>
        <MarketStatsTotal
          totalValueLocked={totalValueLockedSum || '0'}
          totalOceanLiquidity={totalOceanLiquiditySum || '0'}
          poolCount={poolCountSum || '0'}
        />{' '}
        <Tooltip
          className={styles.info}
          content={
            <MarketStatsTooltip
              totalValueLocked={totalValueLocked}
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
