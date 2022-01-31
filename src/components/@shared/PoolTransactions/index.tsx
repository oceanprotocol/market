import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import Time from '@shared/atoms/Time'
import Table from '@shared/atoms/Table'
import AssetTitle from '@shared/AssetList/AssetListTitle'
import { useUserPreferences } from '@context/UserPreferences'
import { gql } from 'urql'
import { TransactionHistory_poolTransactions as TransactionHistoryPoolTransactions } from '../../../@types/subgraph/TransactionHistory'
import web3 from 'web3'
import { fetchDataForMultipleChains } from '@utils/subgraph'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import NetworkName from '@shared/NetworkName'
import { retrieveDDOListByDIDs } from '@utils/aquarius'
import { CancelToken } from 'axios'
import Title from './Title'
import styles from './index.module.css'
import { Asset, LoggerInstance } from '@oceanprotocol/lib'
import { useCancelToken } from '@hooks/useCancelToken'

const REFETCH_INTERVAL = 20000

const txHistoryQueryByPool = gql`
  query TransactionHistoryByPool($user: String, $pool: String) {
    poolTransactions(
      orderBy: timestamp
      orderDirection: desc
      where: { user: $user, pool: $pool }
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
        id
      }
    }
  }
`

export interface PoolTransaction extends TransactionHistoryPoolTransactions {
  networkId: number
  ddo: Asset
}

const columns = [
  {
    name: 'Title',
    selector: function getTitleRow(row: PoolTransaction) {
      return <Title row={row} />
    }
  },
  {
    name: 'Data Set',
    selector: function getAssetRow(row: PoolTransaction) {
      return <AssetTitle ddo={row.ddo} />
    }
  },
  {
    name: 'Network',
    selector: function getNetwork(row: PoolTransaction) {
      return <NetworkName networkId={row.networkId} />
    },
    maxWidth: '12rem'
  },
  {
    name: 'Time',
    selector: function getTimeRow(row: PoolTransaction) {
      return (
        <Time
          className={styles.time}
          date={row.timestamp.toString()}
          relative
          isUnix
        />
      )
    },
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
  poolChainId?: number[]
  minimal?: boolean
  accountId: string
}): ReactElement {
  const [transactions, setTransactions] = useState<PoolTransaction[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { chainIds } = useUserPreferences()
  const { appConfig } = useSiteMetadata()
  const [dataFetchInterval, setDataFetchInterval] = useState<NodeJS.Timeout>()
  const [data, setData] = useState<PoolTransaction[]>()
  const cancelToken = useCancelToken()

  const getPoolTransactionData = useCallback(async () => {
    const variables = {
      user: accountId?.toLowerCase(),
      pool: poolAddress?.toLowerCase()
    }
    const transactions: PoolTransaction[] = []
    const result = await fetchDataForMultipleChains(
      poolAddress ? txHistoryQueryByPool : txHistoryQuery,
      variables,
      poolAddress ? poolChainId : chainIds
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
      const didList: string[] = []

      for (let i = 0; i < data.length; i++) {
        const { address } = data[i].datatoken
        const did = web3.utils
          .toChecksumAddress(address)
          .replace('0x', 'did:op:')
        didList.push(did)
      }
      if (didList.length === 0) {
        setIsLoading(false)
        return
      }
      const ddoList = await retrieveDDOListByDIDs(
        didList,
        chainIds,
        cancelToken
      )
      for (let i = 0; i < data.length; i++) {
        poolTransactions.push({
          ...data[i],
          networkId: ddoList[i]?.chainId,
          ddo: ddoList[i]
        })
      }
      const sortedTransactions = poolTransactions.sort(
        (a, b) => b.timestamp - a.timestamp
      )

      setTransactions(sortedTransactions)
      setIsLoading(false)
    },
    [data, chainIds, setIsLoading]
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
    />
  ) : (
    <div>Please connect your Web3 wallet.</div>
  )
}
