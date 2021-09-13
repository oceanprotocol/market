import React, { ReactElement, useEffect, useState } from 'react'
import Time from '../../atoms/Time'
import Table from '../../atoms/Table'
import AssetTitle from '../AssetListTitle'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { gql } from 'urql'
import { TransactionHistory_poolTransactions as TransactionHistoryPoolTransactions } from '../../../@types/apollo/TransactionHistory'
import web3 from 'web3'
import { useWeb3 } from '../../../providers/Web3'
import { fetchDataForMultipleChains } from '../../../utils/subgraph'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'
import NetworkName from '../../atoms/NetworkName'
import { retrieveDDO } from '../../../utils/aquarius'
import axios from 'axios'
import Title from './Title'
import styles from './index.module.css'

const REFETCH_INTERVAL = 20000

const txHistoryQueryByPool = gql`
  query TransactionHistoryByPool($user: String, $pool: String) {
    poolTransactions(
      orderBy: timestamp
      orderDirection: desc
      where: { userAddress: $user, poolAddress: $pool }
      first: 1000
    ) {
      tx
      event
      timestamp
      poolAddress {
        datatokenAddress
      }
      tokens {
        poolToken {
          symbol
        }
        value
        type
        tokenAddress
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
      tx
      event
      timestamp
      poolAddress {
        datatokenAddress
      }
      tokens {
        poolToken {
          symbol
        }
        value
        type
        tokenAddress
      }
    }
  }
`

export interface Datatoken {
  symbol: string
}

export interface PoolTransaction extends TransactionHistoryPoolTransactions {
  networkId: number
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
      const did = web3.utils
        .toChecksumAddress(row.poolAddress.datatokenAddress)
        .replace('0x', 'did:op:')

      return <AssetTitle did={did} />
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
  minimal
}: {
  poolAddress?: string
  poolChainId?: number[]
  minimal?: boolean
}): ReactElement {
  const { accountId } = useWeb3()
  const [logs, setLogs] = useState<PoolTransaction[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { chainIds } = useUserPreferences()
  const { appConfig } = useSiteMetadata()
  const [dataFetchInterval, setDataFetchInterval] = useState<NodeJS.Timeout>()
  const [data, setData] = useState<PoolTransaction[]>()

  async function fetchPoolTransactionData() {
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
  }

  function refetchPoolTransactions() {
    if (!dataFetchInterval) {
      setDataFetchInterval(
        setInterval(function () {
          fetchPoolTransactionData()
        }, REFETCH_INTERVAL)
      )
    }
  }

  useEffect(() => {
    return () => {
      clearInterval(dataFetchInterval)
    }
  }, [dataFetchInterval])

  useEffect(() => {
    if (!appConfig.metadataCacheUri) return

    async function getTransactions() {
      const poolTransactions: PoolTransaction[] = []
      const source = axios.CancelToken.source()
      try {
        setIsLoading(true)

        if (!data) {
          await fetchPoolTransactionData()
          return
        }
        const poolTransactionsData = data.map((obj) => ({ ...obj }))

        for (let i = 0; i < poolTransactionsData.length; i++) {
          const did = web3.utils
            .toChecksumAddress(
              poolTransactionsData[i].poolAddress.datatokenAddress
            )
            .replace('0x', 'did:op:')
          const ddo = await retrieveDDO(did, source.token)
          poolTransactionsData[i].networkId = ddo.chainId
          poolTransactions.push(poolTransactionsData[i])
        }
        const sortedTransactions = poolTransactions.sort(
          (a, b) => b.timestamp - a.timestamp
        )
        setLogs(sortedTransactions)
        refetchPoolTransactions()
      } catch (error) {
        console.error('Error fetching pool transactions: ', error.message)
      } finally {
        setIsLoading(false)
      }
    }
    getTransactions()
  }, [accountId, chainIds, appConfig.metadataCacheUri, poolAddress, data])

  return accountId ? (
    <Table
      columns={minimal ? columnsMinimal : columns}
      data={logs}
      isLoading={isLoading}
      noTableHead={minimal}
      dense={minimal}
      pagination={minimal ? logs?.length >= 4 : logs?.length >= 9}
      paginationPerPage={minimal ? 5 : 10}
    />
  ) : (
    <div>Please connect your Web3 wallet.</div>
  )
}
