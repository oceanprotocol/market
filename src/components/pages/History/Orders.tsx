import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean } from '@oceanprotocol/react'
import Table from '../../atoms/Table'
import { gql, useQuery } from '@apollo/client'
import Time from '../../atoms/Time'
import styles from './Orders.module.css'
import web3 from 'web3'
import AssetTitle from '../../../components/molecules/AssetListTitle'

const getTokenOrders = gql`
  query OrdersData($user: String!) {
    tokenOrders(
      orderBy: timestamp
      orderDirection: desc
      where: { payer: $user }
    ) {
      consumer {
        id
      }
      id
      timestamp
      tx
      serviceId
    }
  }
`

const columns = [
  {
    name: 'Time',
    selector: function getTimeRow(row: ) {
      return (
        <Time
          className={styles.time}
          date={row.timestamp.toString()}
          relative
          isUnix
        />
      )
    }
  },
  {
    name: 'Data Set',
    selector: function getAssetRow(row: ) {
      const did = web3.utils
        .toChecksumAddress(row.poolAddress.datatokenAddress)
        .replace('0x', 'did:op:')
      return <AssetTitle did={did} />
    }
  },
  {
    name: 'Title'
  }
]

export default function ComputeJobs(): ReactElement {
  const { accountId } = useOcean()
  const [orders, setOrders] = useState()
  const { data } = useQuery(getTokenOrders, {
    variables: { user: accountId?.toLowerCase() }
  })

  useEffect(() => {
    if (!data) return
    console.log('DATA: ', data)
    setOrders(data.tokenOrders)
  }, [data])

  return (
    <Table
      columns={columns}
      data={orders}
      paginationPerPage={10}
      emptyMessage="Your orders will show up here"
    />
  )
}
