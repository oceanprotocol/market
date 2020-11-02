import { PoolTransaction } from '@oceanprotocol/lib/dist/node/balancer/OceanPool'
import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import EtherscanLink from '../atoms/EtherscanLink'
import Time from '../atoms/Time'
import Table from '../atoms/Table'
import AssetTitle from './AssetTitle'
import styles from './PoolTransactions.module.css'
import { formatCurrency } from '@coingecko/cryptoformat'
import { useUserPreferences } from '../../providers/UserPreferences'

function formatNumber(number: number, locale: string) {
  return formatCurrency(number, '', locale, true, {
    significantFigures: 6
  })
}

function Title({ row }: { row: PoolTransaction }) {
  const { ocean, networkId } = useOcean()
  const [dtSymbol, setDtSymbol] = useState<string>()
  const { locale } = useUserPreferences()

  const title = row.tokenAmountIn
    ? `Add ${formatNumber(Number(row.tokenAmountIn), locale)} ${
        dtSymbol || 'OCEAN'
      }`
    : `Remove ${formatNumber(Number(row.tokenAmountOut), locale)} ${
        dtSymbol || 'OCEAN'
      }`

  useEffect(() => {
    if (!ocean) return

    async function getSymbol() {
      const symbol = await ocean.datatokens.getSymbol(
        row.tokenIn || row.tokenOut
      )
      setDtSymbol(symbol)
    }
    getSymbol()
  }, [ocean, row])

  return (
    <EtherscanLink networkId={networkId} path={`/tx/${row.transactionHash}`}>
      {title}
    </EtherscanLink>
  )
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
