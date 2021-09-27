import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import Time from '../../atoms/Time'
import Table from '../../atoms/Table'
import AssetTitle from '../AssetListTitle'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { gql } from 'urql'
import { TransactionHistory_poolTransactions as TransactionHistoryPoolTransactions } from '../../../@types/apollo/TransactionHistory'
import web3 from 'web3'
import { fetchDataForMultipleChains } from '../../../utils/subgraph'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'
import NetworkName from '../../atoms/NetworkName'
import { retrieveDDO } from '../../../utils/aquarius'
import axios, { CancelToken } from 'axios'
import Title from './Title'
import styles from './index.module.css'
import { DDO, Logger } from '@oceanprotocol/lib'

const REFETCH_INTERVAL = 20000

const txHistoryQueryByPool = gql`
  query TransactionHistoryByPool($user: String, $pool: String) {
    poolTransactions(
      orderBy: timestamp
      orderDirection: desc
      where: { userAddress: $user, poolAddress: $pool }
      first: 1000
    ) {
      tokens {
        poolToken {
          id
          symbol
        }
        value
        type
        tokenAddress
      }
      tx
      event
      timestamp
      poolAddress {
        datatokenAddress
      }
    }
  }
`
const txHistoryQuery = gql`
  query TransactionHistory($user: String) {
    poolTransactions(
      orderBy: timestamp
      orderDirection: desc
      where: { userAddress: $user }
      first: 1000
    ) {
      tokens {
        poolToken {
          id
          symbol
        }
        value
        type
        tokenAddress
      }
      tx
      event
      timestamp
      poolAddress {
        datatokenAddress
      }
    }
  }
`

export interface Datatoken {
  symbol: string
}

export interface PoolTransaction extends TransactionHistoryPoolTransactions {
  networkId: number
  ddo: DDO
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
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { chainIds } = useUserPreferences()
  const { appConfig } = useSiteMetadata()
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
      if (!data) return

      const poolTransactions: PoolTransaction[] = []

      for (let i = 0; i < data.length; i++) {
        const { datatokenAddress } = data[i].poolAddress
        const did = web3.utils
          .toChecksumAddress(datatokenAddress)
          .replace('0x', 'did:op:')
        const ddo = await retrieveDDO(did, cancelToken)
        ddo &&
          poolTransactions.push({
            ...data[i],
            networkId: ddo?.chainId,
            ddo
          })
      }
      const sortedTransactions = poolTransactions.sort(
        (a, b) => b.timestamp - a.timestamp
      )
      setTransactions(sortedTransactions)
    },
    [data]
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
        Logger.error('Error fetching pool transactions: ', error.message)
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
    const cancelTokenSource = axios.CancelToken.source()

    async function transformData() {
      try {
        setIsLoading(true)
        await getPoolTransactions(cancelTokenSource.token)
      } catch (error) {
        Logger.error('Error fetching pool transactions: ', error.message)
      } finally {
        setIsLoading(false)
      }
    }
    transformData()

    return () => {
      cancelTokenSource.cancel()
    }
  }, [getPoolTransactions])

  return chainIds.length === 0 ? (
    <div>Please select a network.</div>
  ) : accountId ? (
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
