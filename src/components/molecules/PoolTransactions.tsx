import { PoolTransaction } from '@oceanprotocol/lib/dist/node/balancer/OceanPool'
import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import EtherscanLink from '../atoms/EtherscanLink'
import Time from '../atoms/Time'
import Table from '../atoms/Table'
import AssetTitle from './AssetListTitle'
import styles from './PoolTransactions.module.css'
import { useUserPreferences } from '../../providers/UserPreferences'
import { Ocean } from '@oceanprotocol/lib'
import { formatPrice } from '../atoms/Price/PriceUnit'
import { gql, useQuery } from '@apollo/client'
import {
  TransactionHistory,
  TransactionHistoryPoolTransactions
} from '../../@types/apollo/TransactionHistory'

const txHistoryQuery = gql`
  query TransactionHistory($user: String, $pool: String) {
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
        value
        type
        tokenAddress
      }
    }
  }
`

async function getSymbol(
  ocean: Ocean,
  tokenAddress: string,
  oceanTokenAddress: string
) {
  const symbol =
    oceanTokenAddress === tokenAddress
      ? 'OCEAN'
      : await ocean.datatokens.getSymbol(tokenAddress)

  return symbol
}

async function getTitle(
  ocean: Ocean,
  row: TransactionHistoryPoolTransactions,
  locale: string,
  oceanTokenAddress: string
) {
  // const addRemoveSymbol = await getSymbol(
  //   ocean,
  //   row.tokenIn || row.tokenOut,
  //   oceanTokenAddress
  // )
  const addRemoveSymbol = 'place'
  const title =
    row.event === 'join'
      ? `Add ${formatPrice('0', locale)} ${addRemoveSymbol}`
      : row.event === 'exit'
      ? `Remove ${formatPrice('0', locale)} ${addRemoveSymbol}`
      : `Swap ${formatPrice('0', locale)} ${'place'} for ${formatPrice(
          '0',
          locale
        )} ${'place'}`

  return title
}

function Title({ row }: { row: TransactionHistoryPoolTransactions }) {
  const { ocean, networkId, config } = useOcean()
  const [title, setTitle] = useState<string>()
  const { locale } = useUserPreferences()

  useEffect(() => {
    if (!ocean || !locale || !row || !config?.oceanTokenAddress) return

    async function init() {
      const title = await getTitle(ocean, row, locale, config.oceanTokenAddress)
      setTitle(title)
    }
    init()
  }, [ocean, row, locale, config?.oceanTokenAddress])

  return title ? (
    <EtherscanLink networkId={networkId} path={`/tx/${row.tx}`}>
      {title}
    </EtherscanLink>
  ) : null
}

function getColumns(minimal?: boolean) {
  return [
    {
      name: 'Title',
      selector: function getTitleRow(row: TransactionHistoryPoolTransactions) {
        return <Title row={row} />
      }
    },
    {
      name: 'Data Set',
      selector: function getAssetRow(row: TransactionHistoryPoolTransactions) {
        const did = row.poolAddress.datatokenAddress.replace('0x', 'did:op:')
        return <AssetTitle did={did} />
      },
      omit: minimal
    },
    {
      name: 'Time',
      selector: function getTimeRow(row: TransactionHistoryPoolTransactions) {
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
}

export default function PoolTransactions({
  poolAddress,
  minimal
}: {
  poolAddress?: string
  minimal?: boolean
}): ReactElement {
  const { ocean, accountId } = useOcean()
  const [logs, setLogs] = useState<TransactionHistoryPoolTransactions[]>()
  const [isLoading, setIsLoading] = useState(false)

  const { data, loading } = useQuery<TransactionHistory>(txHistoryQuery, {
    variables: {
      user: accountId.toLowerCase(),
      pool: poolAddress.toLowerCase()
    },
    pollInterval: 20000
  })

  useEffect(() => {
    if (!data) return
    console.log(data.poolTransactions)
    setLogs(data.poolTransactions)
  }, [data, loading])

  useEffect(() => {
    async function getLogs() {
      if (!ocean || !accountId) return

      setIsLoading(true)
      const logs = poolAddress
        ? await ocean.pool.getPoolLogs(poolAddress, 0, accountId)
        : await ocean.pool.getAllPoolLogs(accountId)
      // sort logs by date, newest first
      const logsSorted = logs.sort((a, b) => {
        if (a.timestamp > b.timestamp) return -1
        if (a.timestamp < b.timestamp) return 1
        return 0
      })
      // setLogs(logsSorted)
      setIsLoading(false)
    }
    getLogs()
  }, [ocean, accountId, poolAddress])

  return (
    <Table
      columns={getColumns(minimal)}
      data={logs}
      isLoading={loading}
      noTableHead={minimal}
      dense={minimal}
      pagination={minimal ? logs?.length >= 4 : logs?.length >= 9}
      paginationPerPage={minimal ? 5 : 10}
      emptyMessage="Your pool transactions will show up here"
    />
  )
}
