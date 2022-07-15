import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import Time from '@shared/atoms/Time'
import Table, { TableOceanColumn } from '@shared/atoms/Table'
import AssetTitle from '@shared/AssetList/AssetListTitle'
import { useUserPreferences } from '@context/UserPreferences'
import { gql } from 'urql'
import { TransactionHistory_poolTransactions as TransactionHistoryPoolTransactions } from '../../../@types/subgraph/TransactionHistory'
import { fetchDataForMultipleChains } from '@utils/subgraph'
import NetworkName from '@shared/NetworkName'
import { getAssetsFromDtList } from '@utils/aquarius'
import { getAsset } from '../../Profile/History/PoolShares/_utils'
import { CancelToken } from 'axios'
import Title from './Title'
import styles from './index.module.css'
import { Asset, LoggerInstance } from '@oceanprotocol/lib'
import { useCancelToken } from '@hooks/useCancelToken'
import { useMarketMetadata } from '@context/MarketMetadata'

const REFETCH_INTERVAL = 20000

const txHistoryQueryByPool = gql`
  query TransactionHistoryByPool($user: String, $pool: String) {
    poolTransactions(
      orderBy: timestamp
      orderDirection: desc
      where: { pool: $pool, user: $user }
      first: 1000
    ) {
      baseToken {
        symbol
        address
      }
      baseTokenValue
      datatoken {
        symbol
        address
      }
      datatokenValue
      type
      tx
      timestamp
      pool {
        datatoken {
          id
        }
        id
      }
    }
  }
`
const txHistoryQuery = gql`
  query TransactionHistory($user: String) {
    poolTransactions(
      orderBy: timestamp
      orderDirection: desc
      where: { user: $user }
      first: 1000
    ) {
      baseToken {
        symbol
        address
      }
      baseTokenValue
      datatoken {
        symbol
        address
      }
      datatokenValue
      type
      tx
      timestamp
      pool {
        datatoken {
          id
        }
        id
      }
    }
  }
`

export interface PoolTransaction extends TransactionHistoryPoolTransactions {
  networkId: number
  asset: Asset
}

const columns: TableOceanColumn<PoolTransaction>[] = [
  {
    name: 'Title',
    selector: (row) => <Title row={row} />
  },
  {
    name: 'Data Set',
    selector: (row) => <AssetTitle asset={row.asset} />
  },
  {
    name: 'Network',
    selector: (row) => <NetworkName networkId={row.networkId} />,
    maxWidth: '12rem'
  },
  {
    name: 'Time',
    selector: (row) => (
      <Time
        className={styles.time}
        date={row.timestamp.toString()}
        relative
        isUnix
      />
    ),
    maxWidth: '10rem'
  }
]

// hack! if we use a function to omit one field this will display a strange refresh to the enduser for each row
const columnsMinimal = [columns[0], columns[3]]

export default function PoolTransactions({
  poolAddress,
  poolChainId,
  minimal,
  accountId
}: {
  poolAddress?: string
  poolChainId?: number
  minimal?: boolean
  accountId: string
}): ReactElement {
  const { chainIds } = useUserPreferences()
  const { appConfig } = useMarketMetadata()
  const cancelToken = useCancelToken()

  const [transactions, setTransactions] = useState<PoolTransaction[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [dataFetchInterval, setDataFetchInterval] = useState<NodeJS.Timeout>()
  const [data, setData] = useState<PoolTransaction[]>()

  const getPoolTransactionData = useCallback(async () => {
    const variables = {
      user: accountId?.toLowerCase(),
      pool: poolAddress?.toLowerCase()
    }
    const transactions: PoolTransaction[] = []
    const result = await fetchDataForMultipleChains(
      poolAddress ? txHistoryQueryByPool : txHistoryQuery,
      variables,
      poolAddress ? [poolChainId] : chainIds
    )

    for (let i = 0; i < result.length; i++) {
      result[i].poolTransactions.forEach((poolTransaction: PoolTransaction) => {
        transactions.push(poolTransaction)
      })
    }

    if (JSON.stringify(data) !== JSON.stringify(transactions)) {
      setData(transactions)
    }
  }, [accountId, chainIds, data, poolAddress, poolChainId])

  const getPoolTransactions = useCallback(
    async (cancelToken: CancelToken) => {
      if (!data) {
        return
      }
      const poolTransactions: PoolTransaction[] = []
      let dtList: string[] = []

      dtList = [...new Set(data.map((item) => item.pool.datatoken.id))]
      if (dtList.length === 0) {
        setTransactions([])
        setIsLoading(false)
        return
      }
      const ddoList = !minimal
        ? await getAssetsFromDtList(dtList, chainIds, cancelToken)
        : []
      for (let i = 0; i < data.length; i++) {
        poolTransactions.push({
          ...data[i],
          networkId: !minimal
            ? getAsset(ddoList, data[i].pool.datatoken.id)?.chainId
            : poolChainId,
          asset: !minimal ? getAsset(ddoList, data[i].pool.datatoken.id) : null
        })
      }
      const sortedTransactions = poolTransactions.sort(
        (a, b) => b.timestamp - a.timestamp
      )

      setTransactions(sortedTransactions)
      setIsLoading(false)
    },
    [data, minimal, chainIds, poolChainId]
  )

  //
  // Get data, periodically
  //
  useEffect(() => {
    if (!appConfig?.metadataCacheUri) return

    async function getTransactions() {
      try {
        await getPoolTransactionData()
        if (dataFetchInterval) return
        const interval = setInterval(async () => {
          await getPoolTransactionData()
        }, REFETCH_INTERVAL)
        setDataFetchInterval(interval)
      } catch (error) {
        LoggerInstance.error(
          'Error fetching pool transactions: ',
          error.message
        )
      }
    }
    getTransactions()

    return () => {
      clearInterval(dataFetchInterval)
    }
  }, [getPoolTransactionData, dataFetchInterval, appConfig.metadataCacheUri])

  //
  // Transform to final transactions
  //
  useEffect(() => {
    if (!cancelToken()) return
    async function transformData() {
      try {
        setIsLoading(true)
        await getPoolTransactions(cancelToken())
      } catch (error) {
        LoggerInstance.error(
          'Error fetching pool transactions: ',
          error.message
        )
      }
    }
    transformData()

    return () => {
      cancelToken()
    }
  }, [cancelToken, getPoolTransactions])

  return accountId ? (
    <Table
      columns={minimal ? columnsMinimal : columns}
      data={transactions}
      isLoading={isLoading}
      noTableHead={minimal}
      dense={minimal}
      pagination={
        minimal ? transactions?.length >= 4 : transactions?.length >= 9
      }
      paginationPerPage={minimal ? 5 : 10}
      emptyMessage={chainIds.length === 0 ? 'No network selected' : null}
    />
  ) : (
    <div>Please connect your Web3 wallet.</div>
  )
}
