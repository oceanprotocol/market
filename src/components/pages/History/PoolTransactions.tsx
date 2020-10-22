import { PoolTransaction } from '@oceanprotocol/lib/dist/node/balancer/OceanPool'
import { useMetadata, useOcean } from '@oceanprotocol/react'
import { Link } from 'gatsby'
import React, { ReactElement, useEffect, useState } from 'react'
import EtherscanLink from '../../atoms/EtherscanLink'
import Time from '../../atoms/Time'
import Dotdotdot from 'react-dotdotdot'
import Table from '../../atoms/Table'

function AssetTitle({ did }: { did: string }): ReactElement {
  const { title } = useMetadata(did)
  return (
    <Dotdotdot clamp={2}>
      <Link to={`/asset/${did}`}>{title || did}</Link>
    </Dotdotdot>
  )
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
  }, [ocean, accountId])

  return <Table columns={columns} data={logs} isLoading={isLoading} />
}
