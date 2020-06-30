import React, { useEffect, useState } from 'react'
import Loader from '../atoms/Loader'
import {
  useOcean,
  OceanConnectionStatus,
  useSearch
} from '@oceanprotocol/react'
import Table from '../atoms/Table'
import Price from '../atoms/Price'
import { fromWei } from 'web3-utils'
import DateCell from '../atoms/Table/DateCell'
import DdoLinkCell from '../atoms/Table/DdoLinkCell'
import { DDO, MetaDataMain } from '@oceanprotocol/squid'
import { findServiceByType } from '../../utils'
import { config } from '../../config/ocean'

const consumedColumns = [
  {
    name: 'Published',
    selector: 'published',
    sortable: true,
    cell: function getCell(row: any) {
      return <DateCell date={row.published} />
    }
  },
  {
    name: 'Name',
    selector: 'name',
    sortable: true,
    cell: function getCell(row: any) {
      return <DdoLinkCell id={row.id} name={row.name} />
    }
  },
  {
    name: 'Price',
    selector: 'price',
    sortable: true,
    cell: function getCell(row: any) {
      return <Price price={fromWei(row.price)} small />
    }
  }
]

export default function ConsumedList() {
  const { ocean, status, accountId, account } = useOcean()
  const [consumedList, setConsumedList] = useState<any>([])
  const { getConsumedList } = useSearch()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function getConsumed() {
      if (!accountId || !ocean || status !== OceanConnectionStatus.CONNECTED)
        return
      setIsLoading(true)

      const consumedItems = await getConsumedList()

      if (!consumedItems) return

      const data = consumedItems.map((ddo) => {
        const { attributes } = findServiceByType(ddo, 'metadata')
        const { name, price, datePublished } = attributes.main as MetaDataMain
        return {
          published: datePublished,
          name: name,
          price: price
        }
      })

      setConsumedList(data)
      setIsLoading(false)
    }
    getConsumed()
  }, [accountId, ocean, status])

  return isLoading ? (
    <Loader />
  ) : account && ocean ? (
    <Table data={consumedList} columns={consumedColumns} />
  ) : (
    <div>Connect your wallet to see your consumed data sets.</div>
  )
}
