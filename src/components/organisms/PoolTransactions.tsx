import { PoolTransaction } from '@oceanprotocol/lib/dist/node/balancer/OceanPool'
import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import EtherscanLink from '../atoms/EtherscanLink'
import Time from '../atoms/Time'
import Table from '../atoms/Table'
import AssetTitle from '../molecules/AssetTitle'

function Title({ row }: { row: PoolTransaction }) {
  const { ocean, networkId } = useOcean()
  const [dtSymbol, setDtSymbol] = useState<string>()

  const title = row.tokenAmountIn
    ? `Add ${row.tokenAmountIn} ${dtSymbol || 'OCEAN'}`
    : `Remove ${row.tokenAmountOut} ${dtSymbol || 'OCEAN'}`

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

  const columns = [
    {
      name: 'Title',
      selector: function getTitleRow(row: PoolTransaction) {
        return <Title row={row} />
      }
    },
    {
      ...(!minimal && {
        name: 'Data Set',
        selector: function getAssetRow(row: PoolTransaction) {
          const did = row.dtAddress.replace('0x', 'did:op:')
          return <AssetTitle did={did} />
        }
      })
    },
    {
      name: 'Time',
      selector: function getTimeRow(row: PoolTransaction) {
        return <Time date={row.timestamp.toString()} relative isUnix />
      }
    }
  ]

  return (
    <Table
      columns={columns}
      data={logs}
      isLoading={isLoading}
      noTableHead={minimal}
      dense={minimal}
    />
  )
}
