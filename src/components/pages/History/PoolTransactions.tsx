import { PoolTransaction } from '@oceanprotocol/lib/dist/node/balancer/OceanPool'
import { useMetadata, useOcean } from '@oceanprotocol/react'
import Loader from '../../atoms/Loader'
import { Link } from 'gatsby'
import React, { ReactElement, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import EtherscanLink from '../../atoms/EtherscanLink'
import Time from '../../atoms/Time'
import styles from './PoolTransactions.module.css'

function AssetTitle({ did }: { did: string }): ReactElement {
  const { title } = useMetadata(did)
  return <Link to={`/asset/${did}`}>{title || did}</Link>
}

function Empty() {
  return <div className={styles.empty}>No results found</div>
}

function Title({ row }: { row: PoolTransaction }) {
  const { ocean } = useOcean()
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
    <EtherscanLink network="rinkeby" path={`/tx/${row.transactionHash}`}>
      {title}
    </EtherscanLink>
  )
}

const columns = [
  {
    name: 'Title',
    selector: function getTitleRow(row: PoolTransaction) {
      return <Title row={row} />
    }
  },
  {
    name: 'Data Set',
    selector: function getAssetRow(row: PoolTransaction) {
      const did = row.dtAddress.replace('0x', 'did:op:')
      return <AssetTitle did={did} />
    }
  },
  {
    name: 'Time',
    selector: function getTimeRow(row: PoolTransaction) {
      return <Time date={row.timestamp.toString()} relative isUnix />
    }
  }
]

export default function PoolTransactions(): ReactElement {
  const { ocean, accountId } = useOcean()
  const [logs, setLogs] = useState<PoolTransaction[]>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function getLogs() {
      if (!ocean || !accountId) return
      setIsLoading(true)
      const logs = await ocean.pool.getAllPoolLogs(accountId)
      setLogs(
        // sort logs by date, newest first
        logs.sort((a, b) => {
          if (a.timestamp > b.timestamp) return -1
          if (a.timestamp < b.timestamp) return 1
          return 0
        })
      )
      setIsLoading(false)
    }
    getLogs()
  }, [ocean, accountId])

  return isLoading ? (
    <Loader />
  ) : (
    <DataTable
      columns={columns}
      data={logs}
      className={styles.table}
      noHeader
      pagination={logs?.length >= 19}
      paginationPerPage={20}
      noDataComponent={<Empty />}
    />
  )
}
