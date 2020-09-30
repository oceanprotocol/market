import { PoolTransaction } from '@oceanprotocol/lib/dist/node/balancer/OceanPool'
import { useOcean } from '@oceanprotocol/react'
import { Link } from 'gatsby'
import React, { ReactElement, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import EtherscanLink from '../../atoms/EtherscanLink'
import Time from '../../atoms/Time'

export default function PoolTransactions(): ReactElement {
  const { ocean, accountId } = useOcean()
  const [logs, setLogs] = useState<PoolTransaction[]>()

  const columns = [
    {
      name: 'Title',
      selector: function getTitleRow(row: PoolTransaction) {
        // TODO: replace hardcoded symbol with symbol fetching based
        // on row.tonenIn & row.tokenOut
        const title = row.tokenAmountIn
          ? `Add ${row.tokenAmountIn} OCEAN`
          : `Remove ${row.tokenAmountOut} OCEAN`

        return (
          <EtherscanLink network="rinkeby" path={`/tx/${row.transactionHash}`}>
            {title}
          </EtherscanLink>
        )
      }
    },
    {
      name: 'Asset',
      selector: function getAssetRow(row: PoolTransaction) {
        const did = row.dtAddress.replace('0x', 'did:op:')
        return <Link to={`/asset/${did}`}>{did}</Link>
      }
    },

    {
      name: 'Time',
      selector: function getTimeRow(row: PoolTransaction) {
        return (
          <Time date={new Date(row.timestamp * 1000).toUTCString()} relative />
        )
      }
    }
  ]

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
      <DataTable columns={columns} data={logs} />
      <pre>
        <code>{JSON.stringify(logs, null, 2)}</code>
      </pre>
    </div>
  )
}
