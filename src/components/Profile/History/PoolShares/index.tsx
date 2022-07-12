import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import Table, { TableOceanColumn } from '@shared/atoms/Table'
import styles from './index.module.css'
import AssetTitle from '@shared/AssetList/AssetListTitle'
import { PoolShares_poolShares as PoolShare } from '../../../../@types/subgraph/PoolShares'
import NetworkName from '@shared/NetworkName'
import Decimal from 'decimal.js'
import { useProfile } from '@context/Profile'
import { useCancelToken } from '@hooks/useCancelToken'
import { useIsMounted } from '@hooks/useIsMounted'
import { useUserPreferences } from '@context/UserPreferences'
import { Asset, LoggerInstance } from '@oceanprotocol/lib'
import { Liquidity } from './Liquidity'
import { getAssetsFromPoolShares } from './_utils'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

export interface AssetPoolShare {
  userLiquidity: string
  poolShare: PoolShare
  networkId: number
  createTime: number
  asset: Asset
}

const columns: TableOceanColumn<AssetPoolShare>[] = [
  {
    name: 'Data Set',
    selector: (row) => <AssetTitle asset={row.asset} />,
    grow: 2
  },
  {
    name: 'Network',
    selector: (row) => <NetworkName networkId={row.networkId} />
  },
  {
    name: 'Your liquidity',
    selector: (row) => <Liquidity row={row} type="user" />,
    right: true
  },
  {
    name: 'Total Value Locked',
    selector: (row) => <Liquidity row={row} type="pool" />,
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

  //
  // Helper: fetch assets from pool shares data
  //
  const fetchPoolSharesAssets = useCallback(async () => {
    if (!poolShares || !chainIds) return

    try {
      const assets = await getAssetsFromPoolShares(
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
    // We do not need to react to `chainIds` changes here, cause changing them
    // triggers change of `poolShares` from `useProfile()` already.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolShares, newCancelToken])

  //
  // 1. Kick off data fetching
  //
  useEffect(() => {
    if (!isMounted()) return

    setLoading(true)
    fetchPoolSharesAssets()
  }, [fetchPoolSharesAssets, isMounted])

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
      emptyMessage={chainIds.length === 0 ? 'No network selected' : null}
    />
  ) : (
    <div>Please connect your Web3 wallet.</div>
  )
}
