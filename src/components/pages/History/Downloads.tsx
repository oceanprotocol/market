import React, { ReactElement, useEffect, useState } from 'react'
import Table from '../../atoms/Table'
import { gql, useQuery } from '@apollo/client'
import Time from '../../atoms/Time'
import { OrdersData_tokenOrders as OrdersDataTokenOrders } from '../../../@types/apollo/OrdersData'
import web3 from 'web3'
import AssetTitle from '../../molecules/AssetListTitle'
import { useWeb3 } from '../../../providers/Web3'
import axios from 'axios'
import { useOcean } from '../../../providers/Ocean'
import { retrieveDDO } from '../../../utils/aquarius'

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
      return <Time date={row.timestamp.toString()} relative isUnix />
    }
  }
]

export default function ComputeDownloads(): ReactElement {
  const { accountId } = useWeb3()
  const [orders, setOrders] = useState<OrdersDataTokenOrders[]>()
  const { data } = useQuery(getTokenOrders, {
    variables: { user: accountId?.toLowerCase() }
  })
  const { config } = useOcean()

  useEffect(() => {
    if (!config.metadataCacheUri || !data) return
    const source = axios.CancelToken.source()

    async function filterAssets() {
      const filteredOrders: OrdersDataTokenOrders[] = []
      for (let i = 0; i < data.tokenOrders.length; i++) {
        const did = web3.utils
          .toChecksumAddress(data.tokenOrders[i].datatokenId.address)
          .replace('0x', 'did:op:')
        const ddo = await retrieveDDO(
          did,
          config?.metadataCacheUri,
          source.token
        )
        if (ddo.service[1].type === 'access') {
          filteredOrders.push(data.tokenOrders[i])
        }
      }
      setOrders(filteredOrders)
    }
    filterAssets()
  }, [config?.metadataCacheUri, data])

  return (
    <Table
      columns={columns}
      data={orders}
      paginationPerPage={10}
      emptyMessage="Your downloads will show up here"
    />
  )
}
