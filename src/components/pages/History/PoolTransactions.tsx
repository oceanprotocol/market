import {
  PoolAction,
  PoolLogs
} from '@oceanprotocol/lib/dist/node/balancer/OceanPool'
import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'

const data: PoolLogs = {
  joins: [
    {
      poolAddress: '0xxxxx',
      caller: '',
      transactionHash: '0xxxxx',
      blockNumber: 2,
      tokenIn: 'OCEAN',
      tokenAmountIn: '10'
    }
  ],
  exits: [],
  swaps: []
}

const columns = [
  {
    name: 'Title',
    selector: (row: PoolAction) => `Add ${row.tokenAmountIn} ${row.tokenIn}`
  },
  {
    name: 'Pool',
    selector: 'poolAddress'
  }
]

export default function PoolTransactions(): ReactElement {
  const { ocean, accountId } = useOcean()
  const [logs, setLogs] = useState<PoolLogs>()

  useEffect(() => {
    async function getLogs() {
      if (!ocean || !accountId) return

      const logs = await ocean.pool.getAllPoolLogs(accountId, true, true, true)
      setLogs(logs)
    }
    getLogs()
  }, [ocean, accountId])

  return (
    <div>
      <DataTable columns={columns} data={data.joins} />
      <pre>
        <code>{JSON.stringify(logs, null, 2)}</code>
      </pre>
    </div>
  )
}
