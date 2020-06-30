import React, { useEffect, useState } from 'react'
import Loader from '../atoms/Loader'
import { MetaDataMain } from '@oceanprotocol/squid'
import {
  useOcean,
  OceanConnectionStatus,
  useSearch
} from '@oceanprotocol/react'
import Table from '../atoms/Table'
import Price from '../atoms/Price'
import { fromWei } from 'web3-utils'
import { findServiceByType } from '../../utils'
import DateCell from '../atoms/Table/DateCell'
import DdoLinkCell from '../atoms/Table/DdoLinkCell'

const publishedColumns = [
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

export default function PublishedList() {
  const { ocean, status, account, accountId } = useOcean()
  const { getPublishedList } = useSearch()
  const [publishedList, setPublishedList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [paginationParams, setPaginationParams] = useState({
    count: 1,
    rowsPerPage: 10,
    page: 1
  })

  useEffect(() => {
    async function getPublished() {
      if (
        !account ||
        !accountId ||
        !ocean ||
        status !== OceanConnectionStatus.CONNECTED
      )
        return

      setIsLoading(true)
      const publishedItems = await getPublishedList(
        paginationParams.page,
        paginationParams.rowsPerPage
      )
      setPaginationParams({
        ...paginationParams,
        count: publishedItems.totalPages
      })

      const data = publishedItems.results.map((ddo) => {
        const { attributes } = findServiceByType(ddo, 'metadata')
        const { name, price, datePublished } = attributes.main as MetaDataMain
        return {
          published: datePublished,
          name: name,
          price: price,
          id: ddo.id
        }
      })

      setPublishedList(data)
      setIsLoading(false)
    }
    getPublished()
  }, [accountId, ocean, status])

  return isLoading ? (
    <Loader />
  ) : account && ocean ? (
    <Table data={publishedList} columns={publishedColumns} />
  ) : (
    <div>Connect your wallet to see your published data sets.</div>
  )
}
