import { PoolTransaction } from '@oceanprotocol/lib/dist/node/balancer/OceanPool'
import { useOcean } from '@oceanprotocol/react'
import { Link } from 'gatsby'
import React, { ReactElement, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import EtherscanLink from '../../atoms/EtherscanLink'
import Time from '../../atoms/Time'
import styles from './PoolTransactions.module.css'

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

export default function PoolTransactions(): ReactElement {
  const { ocean, accountId } = useOcean()
  const [logs, setLogs] = useState<PoolTransaction[]>()

  useEffect(() => {
    async function getLogs() {
      if (!ocean || !accountId) return

      const logs = await ocean.pool.getAllPoolLogs(
        '0xe08A1dAe983BC701D05E492DB80e0144f8f4b909'
      )
      // limit to 100 latest transactions for now
      setLogs(logs.slice(0, 99))
    }
    getLogs()
  }, [ocean, accountId])

  return (
    <DataTable
      columns={columns}
      data={logs}
      className={styles.table}
      noHeader
      pagination={logs?.length >= 19}
      paginationPerPage={20}
    />
  )
}
