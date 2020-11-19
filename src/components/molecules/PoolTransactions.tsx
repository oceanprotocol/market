import { PoolTransaction } from '@oceanprotocol/lib/dist/node/balancer/OceanPool'
import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import EtherscanLink from '../atoms/EtherscanLink'
import Time from '../atoms/Time'
import Table from '../atoms/Table'
import AssetTitle from './AssetListTitle'
import styles from './PoolTransactions.module.css'
import { formatCurrency } from '@coingecko/cryptoformat'
import { useUserPreferences } from '../../providers/UserPreferences'
import { Ocean } from '@oceanprotocol/lib'

function formatNumber(number: number, locale: string) {
  return formatCurrency(number, '', locale, true, {
    significantFigures: 6
  })
}

async function getSymbol(ocean: Ocean, contractAddress: string) {
  // OCEAN contract on mainnet, rinkeby
  const oceanContracts = [
    '0x967da4048cD07aB37855c090aAF366e4ce1b9F48',
    '0x8967bcf84170c91b0d24d4302c2376283b0b3a07'
  ]

  const symbol = oceanContracts.includes(contractAddress)
    ? 'OCEAN'
    : await ocean.datatokens.getSymbol(contractAddress)

  return symbol
}

async function getTitle(ocean: Ocean, row: PoolTransaction, locale: string) {
  const addRemoveSymbol = await getSymbol(ocean, row.tokenIn || row.tokenOut)

  const title =
    row.type === 'join'
      ? `Add ${formatNumber(
          Number(row.tokenAmountIn),
          locale
        )} ${addRemoveSymbol}`
      : row.type === 'exit'
      ? `Remove ${formatNumber(
          Number(row.tokenAmountOut),
          locale
        )} ${addRemoveSymbol}`
      : `Swap ${formatNumber(
          Number(row.tokenAmountIn),
          locale
        )} ${await getSymbol(ocean, row.tokenIn)} for ${formatNumber(
          Number(row.tokenAmountOut),
          locale
        )} ${await getSymbol(ocean, row.tokenOut)}`

  return title
}

function Title({ row }: { row: PoolTransaction }) {
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
    <EtherscanLink networkId={networkId} path={`/tx/${row.transactionHash}`}>
      {title}
    </EtherscanLink>
  ) : null
}

function getColumns(minimal?: boolean) {
  return [
    {
      name: 'Title',
      selector: function getTitleRow(row: PoolTransaction) {
        return <Title row={row} />
      },
      minWidth: '14rem',
      grow: 1
    },
    {
      name: 'Data Set',
      selector: function getAssetRow(row: PoolTransaction) {
        const did = row.dtAddress.replace('0x', 'did:op:')
        return <AssetTitle did={did} />
      },
      omit: minimal
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
      }
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
  const [logs, setLogs] = useState<PoolTransaction[]>()
  const [isLoading, setIsLoading] = useState(false)

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
      setLogs(logsSorted)
      setIsLoading(false)
    }
    getLogs()
  }, [ocean, accountId, poolAddress])

  return (
    <Table
      columns={getColumns(minimal)}
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
