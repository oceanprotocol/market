import React, { ReactElement, useEffect, useState } from 'react'
import ExplorerLink from '../atoms/ExplorerLink'
import Time from '../atoms/Time'
import Table from '../atoms/Table'
import AssetTitle from './AssetListTitle'
import styles from './PoolTransactions.module.css'
import { useUserPreferences } from '../../providers/UserPreferences'
import { DDO, Ocean } from '@oceanprotocol/lib'
import { formatPrice } from '../atoms/Price/PriceUnit'
import { gql } from 'urql'
import {
  TransactionHistory,
  TransactionHistory_poolTransactions as TransactionHistoryPoolTransactions
} from '../../@types/apollo/TransactionHistory'

import web3 from 'web3'
import { useWeb3 } from '../../providers/Web3'
import { fetchDataForMultipleChains } from '../../utils/subgraph'

import { getOceanConfig } from '../../utils/ocean'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import { retrieveDDO } from '../../utils/aquarius'
import axios from 'axios'

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

async function getSymbol(ddo: DDO, tokenAddress: string) {
  const symbol =
    ddo.dataTokenInfo.address.toLowerCase() !== tokenAddress.toLowerCase()
      ? 'OCEAN'
      : ddo.dataTokenInfo.symbol

  return symbol
}

async function getTitle(
  row: TransactionHistoryPoolTransactions,
  locale: string
) {
  const source = axios.CancelToken.source()

  const did = web3.utils
    .toChecksumAddress(row.poolAddress.datatokenAddress)
    .replace('0x', 'did:op:')
  const ddo = await retrieveDDO(did, source.token)
  // const config = getOceanConfig(ddo.chainId)
  // const newOcean = await Ocean.getInstance(config)

  let title = ''
  switch (row.event) {
    case 'swap': {
      const inToken = row.tokens.filter((x) => x.type === 'in')[0]
      // in addr == dt addr => dt altfel, ocean
      const inTokenSymbol = await getSymbol(ddo, inToken.tokenAddress)
      const outToken = row.tokens.filter((x) => x.type === 'out')[0]
      const outTokenSymbol = await getSymbol(ddo, outToken.tokenAddress)
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
      const firstToken = row.tokens.filter(
        (x) =>
          x.tokenAddress.toLowerCase() !==
          ddo.dataTokenInfo.address.toLowerCase()
      )[0]
      const firstTokenSymbol = await getSymbol(ddo, firstToken.tokenAddress)
      const secondToken = row.tokens.filter(
        (x) =>
          x.tokenAddress.toLowerCase() ===
          ddo.dataTokenInfo.address.toLowerCase()
      )[0]
      const secondTokenSymbol = await getSymbol(ddo, secondToken.tokenAddress)
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
        const tokenSymbol = await getSymbol(ddo, row.tokens[i].tokenAddress)
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
  const { networkId } = useWeb3()
  const [title, setTitle] = useState<string>()
  const { locale } = useUserPreferences()

  useEffect(() => {
    const config = getOceanConfig(4)
    if (!config || !locale || !row) return
    async function init() {
      const title = await getTitle(row, locale)
      setTitle(title)
    }
    init()
  }, [row, locale])

  return title ? (
    <ExplorerLink networkId={networkId} path={`/tx/${row.tx}`}>
      <span className={styles.titleText}>{title}</span>
    </ExplorerLink>
  ) : null
}

const columns = [
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
    }
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

// hack! if we use a function to omit one field this will display a strange refresh to the enduser for each row
const columnsMinimal = [columns[0], columns[2]]

export default function PoolTransactions({
  poolAddress,
  minimal
}: {
  poolAddress?: string
  minimal?: boolean
}): ReactElement {
  const { accountId } = useWeb3()
  const [logs, setLogs] = useState<TransactionHistoryPoolTransactions[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { chainIds } = useUserPreferences()
  const { appConfig } = useSiteMetadata()

  useEffect(() => {
    if (!appConfig.metadataCacheUri) return
    const variables = { user: accountId?.toLowerCase() }
    async function getTransactions() {
      const data: TransactionHistoryPoolTransactions[] = []
      try {
        setIsLoading(true)
        const result = await fetchDataForMultipleChains(
          poolAddress ? txHistoryQueryByPool : txHistoryQuery,
          variables,
          chainIds
        )
        for (let i = 0; i < result.length; i++) {
          result[i].poolTransactions.forEach(
            (poolTransaction: TransactionHistoryPoolTransactions) => {
              data.push(poolTransaction)
            }
          )
        }
        setLogs(data)
      } catch (error) {
        console.error('Error fetching pool transactions: ', error.message)
      } finally {
        setIsLoading(false)
      }
    }
    getTransactions()
  }, [accountId, chainIds, appConfig.metadataCacheUri])

  return (
    <Table
      columns={minimal ? columnsMinimal : columns}
      data={logs}
      isLoading={isLoading}
      noTableHead={minimal}
      dense={minimal}
      pagination={minimal ? logs?.length >= 4 : logs?.length >= 9}
      paginationPerPage={minimal ? 5 : 10}
      emptyMessage="Your pool transactions will show up here"
    />
  )
}
