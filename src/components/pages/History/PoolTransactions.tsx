import { PoolTransaction } from '@oceanprotocol/lib/dist/node/balancer/OceanPool'
import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'

const data: PoolTransaction[] = [
  {
    poolAddress: '0xxxxx',
    dtAddress: '0xxxxx',
    caller: '0xxxxx',
    transactionHash: '0xxxxx',
    blockNumber: 2,
    timestamp: 1,
    tokenIn: 'OCEAN',
    tokenAmountIn: '10',
    type: 'join'
  }
]

const columns = [
  {
    name: 'Title',
    selector: (row: PoolTransaction) =>
      `Add ${row.tokenAmountIn} ${row.tokenIn}`
  },
  {
    name: 'Pool',
    selector: 'poolAddress'
  },
  {
    name: 'Account',
    selector: 'caller'
  }
]

export default function PoolTransactions(): ReactElement {
  const { ocean, accountId } = useOcean()
  const [logs, setLogs] = useState<PoolTransaction[]>()

  useEffect(() => {
    async function getLogs() {
      if (!ocean || !accountId) return

      const logs = await ocean.pool.getAllPoolLogs(accountId)
      setLogs(logs)
    }
    getLogs()
  }, [ocean, accountId])

  return (
    <div>
      <DataTable columns={columns} data={data} />
      <pre>
        <code>{JSON.stringify(logs, null, 2)}</code>
      </pre>
    </div>
  )
}
