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

import web3 from 'web3'

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
        value
        type
        tokenAddress
      }
    }
  }
`
async function getSymbol(ocean: Ocean, tokenAddress: string) {
  const symbol =
    ocean.pool.oceanAddress === tokenAddress
      ? 'OCEAN'
      : await ocean.datatokens.getSymbol(tokenAddress)

  return symbol
}

async function getTitle(
  ocean: Ocean,
  row: TransactionHistoryPoolTransactions,
  locale: string
) {
  let title = ''

  switch (row.event) {
    case 'swap': {
      const inToken = row.tokens.filter((x) => x.type === 'in')[0]
      const inTokenSymbol = await getSymbol(ocean, inToken.tokenAddress)
      const outToken = row.tokens.filter((x) => x.type === 'out')[0]
      const outTokenSymbol = await getSymbol(ocean, outToken.tokenAddress)
      title += `Swap ${formatPrice(
        Math.abs(inToken.value).toString(),
        locale
      )}${inTokenSymbol} for ${formatPrice(
        Math.abs(outToken.value).toString(),
        locale
      )}${outTokenSymbol}`
      break
    }
    case 'setup': {
      const firstToken = row.tokens[0]
      const firstTokenSymbol = await getSymbol(ocean, firstToken.tokenAddress)
      const secondToken = row.tokens[1]
      const secondTokenSymbol = await getSymbol(ocean, secondToken.tokenAddress)
      title += `Create pool with ${formatPrice(
        Math.abs(firstToken.value).toString(),
        locale
      )}${firstTokenSymbol} and ${formatPrice(
        Math.abs(secondToken.value).toString(),
        locale
      )}${secondTokenSymbol}`
      break
    }
    case 'join':
    case 'exit': {
      for (let i = 0; i < row.tokens.length; i++) {
        const tokenSymbol = await getSymbol(ocean, row.tokens[i].tokenAddress)
        if (i > 0) title += '\n'
        title += `${row.event === 'join' ? 'Add' : 'Remove'} ${formatPrice(
          Math.abs(row.tokens[i].value).toString(),
          locale
        )}${tokenSymbol}`
      }
      break
    }
  }

  return title
}

function Title({ row }: { row: TransactionHistoryPoolTransactions }) {
  const { ocean, networkId } = useOcean()
  const [title, setTitle] = useState<string>()
  const { locale } = useUserPreferences()

  useEffect(() => {
    if (!ocean || !locale || !row) return

    async function init() {
      const title = await getTitle(ocean, row, locale)
      setTitle(title)
    }
    init()
  }, [ocean, row, locale])

  return title ? (
    <EtherscanLink networkId={networkId} path={`/tx/${row.tx}`}>
      <span className={styles.titleText}>{title}</span>
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
        const did = web3.utils
          .toChecksumAddress(row.poolAddress.datatokenAddress)
          .replace('0x', 'did:op:')

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
  const { accountId } = useOcean()
  const [logs, setLogs] = useState<TransactionHistoryPoolTransactions[]>()

  const { data, loading } = useQuery<TransactionHistory>(
    poolAddress ? txHistoryQueryByPool : txHistoryQuery,
    {
      variables: {
        user: accountId?.toLowerCase(),
        pool: poolAddress?.toLowerCase()
      },
      pollInterval: 20000
    }
  )

  useEffect(() => {
    if (!data) return
    setLogs(data.poolTransactions)
  }, [data, loading])

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
