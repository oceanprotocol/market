import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean } from '@oceanprotocol/react'
import Table from '../../atoms/Table'
import { gql, useQuery } from '@apollo/client'
import Time from '../../atoms/Time'
import styles from './Orders.module.css'
import { OrdersData_tokenOrders as OrdersDataTokenOrders } from '../../../@types/apollo/OrdersData'
import web3 from 'web3'
import AssetTitle from '../../molecules/AssetListTitle'

const getTokenOrders = gql`
  query OrdersData($user: String!) {
    tokenOrders(
      orderBy: timestamp
      orderDirection: desc
      where: { consumer: $user }
    ) {
      datatokenId {
        address
        symbol
      }
      timestamp
      tx
    }
  }
`

const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: OrdersDataTokenOrders) {
      const did = web3.utils
        .toChecksumAddress(row.datatokenId.address)
        .replace('0x', 'did:op:')

      return <AssetTitle did={did} />
    }
  },
  {
    name: 'Datatoken',
    selector: function getTitleRow(row: OrdersDataTokenOrders) {
      return row.datatokenId.symbol
    }
  },
  {
    name: 'Time',
    selector: function getTimeRow(row: OrdersDataTokenOrders) {
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

export default function ComputeDownloads(): ReactElement {
  const { accountId } = useOcean()
  const [orders, setOrders] = useState<OrdersDataTokenOrders[]>()
  const { data } = useQuery(getTokenOrders, {
    variables: { user: accountId?.toLowerCase() }
  })

  useEffect(() => {
    if (!data) return
    setOrders(data.tokenOrders)
  }, [data])

  return (
    <Table
      columns={columns}
      data={orders}
      paginationPerPage={10}
      emptyMessage="Your downloads will show up here"
    />
  )
}
