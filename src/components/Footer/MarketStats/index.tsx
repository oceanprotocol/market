import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { OperationContext } from 'urql'
import { fetchData, getSubgraphUri } from '@utils/subgraph'
import useNetworkMetadata, {
  filterNetworksByType
} from '@hooks/useNetworkMetadata'
import { LoggerInstance } from '@oceanprotocol/lib'
import styles from './index.module.css'
import { FooterStatsValues_globalStatistics as FooterStatsValuesGlobalStatistics } from '../../../../src/@types/subgraph/FooterStatsValues'
import MarketStatsTotal from './Total'
import { queryGlobalStatistics } from './_queries'
import { StatsTotal } from './_types'
import { useMarketMetadata } from '@context/MarketMetadata'
import Tooltip from '@shared/atoms/Tooltip'
import Markdown from '@shared/Markdown'
import content from '../../../../content/footer.json'
import { getTotalAllocatedAndLocked } from '@utils/veAllocation'
import PriceUnit from '@shared/Price/PriceUnit'

const initialTotal: StatsTotal = {
  nfts: 0,
  datatokens: 0,
  orders: 0,
  veAllocated: 0,
  veLocked: 0
}

export default function MarketStats(): ReactElement {
  const { appConfig } = useMarketMetadata()
  const { networksList } = useNetworkMetadata()
  const [mainChainIds, setMainChainIds] = useState<number[]>()
  const [data, setData] = useState<{
    [chainId: number]: FooterStatsValuesGlobalStatistics
  }>()
  const [total, setTotal] = useState(initialTotal)

  //
  // Set the main chain ids we want to display stats for
  //
  useEffect(() => {
    if (!networksList || !appConfig || !appConfig?.chainIds) return

    const mainChainIdsList = filterNetworksByType(
      'mainnet',
      appConfig.chainIds,
      networksList
    )
    setMainChainIds(mainChainIdsList)
  }, [appConfig, appConfig?.chainIds, networksList])

  //
  // Helper: fetch data from subgraph
  //
  const getMarketStats = useCallback(async () => {
    if (!mainChainIds?.length) return
    const newData: {
      [chainId: number]: FooterStatsValuesGlobalStatistics
    } = {}
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
        newData[chainId] = response.data.globalStatistics[0]
      } catch (error) {
        LoggerInstance.error('Error fetching global stats: ', error.message)
      }
    }

    const veTotals = await getTotalAllocatedAndLocked()
    total.veAllocated = veTotals.totalAllocated
    total.veLocked = veTotals.totalLocked
    setTotal(total)

    setData(newData)
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
    const newTotal: StatsTotal = total

    for (const chainId of mainChainIds) {
      try {
        const nftCount = data[chainId]?.nftCount || 0
        const datatokenCount = data[chainId]?.datatokenCount || 0
        const orderCount = data[chainId]?.orderCount || 0

        newTotal.nfts += nftCount
        newTotal.datatokens += datatokenCount
        newTotal.orders += orderCount
      } catch (error) {
        LoggerInstance.error('Error data manipulation: ', error.message)
      }
    }

    setTotal(newTotal)
  }, [data, mainChainIds])

  return (
    <div className={styles.stats}>
      <div>
        <MarketStatsTotal total={total} />{' '}
        <Tooltip
          className={styles.info}
          content={
            <Markdown className={styles.note} text={content.stats.note} />
          }
        />
      </div>
      <div>
        <PriceUnit
          decimals="0"
          price={total.veLocked}
          symbol="OCEAN"
          size="small"
        />{' '}
        locked.{' '}
        <PriceUnit
          decimals="0"
          price={total.veAllocated}
          symbol="veOCEAN"
          size="small"
        />{' '}
        allocated.
      </div>
    </div>
  )
}
