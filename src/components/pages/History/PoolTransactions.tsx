import { PoolLogs } from '@oceanprotocol/lib/dist/node/balancer/OceanPool'
import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'

export default function PoolTransactions(): ReactElement {
  const { ocean, accountId } = useOcean()
  const [logs, setLogs] = useState<PoolLogs>()

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
      <pre>
        <code>{JSON.stringify(logs, null, 2)}</code>
      </pre>
    </div>
  )
}
