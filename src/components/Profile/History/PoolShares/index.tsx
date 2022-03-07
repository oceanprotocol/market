import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import Table from '@shared/atoms/Table'
import styles from './index.module.css'
import AssetTitle from '@shared/AssetList/AssetListTitle'
import { PoolShares_poolShares as PoolShare } from '../../../../@types/subgraph/PoolShares'
import NetworkName from '@shared/NetworkName'
import { CancelToken } from 'axios'
import Decimal from 'decimal.js'
import { useProfile } from '@context/Profile'
import { useCancelToken } from '@hooks/useCancelToken'
import { useIsMounted } from '@hooks/useIsMounted'
import { useUserPreferences } from '@context/UserPreferences'
import { Asset, LoggerInstance } from '@oceanprotocol/lib'
import { Liquidity } from './Liquidity'
import { getPoolSharesAssets } from './_utils'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

const REFETCH_INTERVAL = 20000

export interface AssetPoolShare {
  userLiquidity: string
  poolShare: PoolShare
  networkId: number
  createTime: number
  asset: Asset
}

const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: AssetPoolShare) {
      return <AssetTitle asset={row.asset} />
    },
    grow: 2
  },
  {
    name: 'Network',
    selector: function getNetwork(row: AssetPoolShare) {
      return <NetworkName networkId={row.networkId} />
    }
  },
  {
    name: 'Liquidity',
    selector: function getAssetRow(row: AssetPoolShare) {
      return <Liquidity row={row} type="user" />
    },
    right: true
  },
  {
    name: 'Pool Liquidity',
    selector: function getAssetRow(row: AssetPoolShare) {
      return <Liquidity row={row} type="pool" />
    },
    right: true
  }
]

export default function PoolShares({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { poolShares } = useProfile()
  const { chainIds } = useUserPreferences()
  const newCancelToken = useCancelToken()
  const isMounted = useIsMounted()

  const [assets, setAssets] = useState<AssetPoolShare[]>()
  const [loading, setLoading] = useState<boolean>(false)
  const [dataFetchInterval, setDataFetchInterval] = useState<NodeJS.Timeout>()

  //
  // Helper: fetch assets from pool shares data
  //
  const fetchPoolSharesAssets = useCallback(async () => {
    if (!poolShares || !chainIds) {
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const assets = await getPoolSharesAssets(
        poolShares,
        chainIds,
        newCancelToken()
      )
      setAssets(assets)
    } catch (error) {
      LoggerInstance.error('Error fetching pool shares: ', error.message)
    } finally {
      setLoading(false)
    }
  }, [chainIds, poolShares, newCancelToken])

  // Helper: start interval fetching
  const initFetchInterval = useCallback(() => {
    if (dataFetchInterval) return

    const newInterval = setInterval(() => {
      fetchPoolSharesAssets()
      LoggerInstance.log(
        `[pool] Refetch interval fired after ${REFETCH_INTERVAL / 1000}s`
      )
    }, REFETCH_INTERVAL)
    setDataFetchInterval(newInterval)

    // Having `accountId` as dependency is important for interval to
    // change after user account switch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFetchInterval, fetchPoolSharesAssets, accountId])

  //
  // 1. Kick off data fetching
  //
  useEffect(() => {
    if (!isMounted()) return

    fetchPoolSharesAssets()
    initFetchInterval()
  }, [fetchPoolSharesAssets, initFetchInterval, isMounted])

  return accountId ? (
    <Table
      columns={columns}
      className={styles.poolSharesTable}
      data={assets}
      pagination
      paginationPerPage={5}
      isLoading={loading}
      sortField="userLiquidity"
      sortAsc={false}
    />
  ) : (
    <div>Please connect your Web3 wallet.</div>
  )
}
