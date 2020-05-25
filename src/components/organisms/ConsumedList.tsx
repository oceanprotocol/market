import React, { useEffect, useState } from 'react'
import Loader from '../atoms/Loader'
import { useWeb3, useOcean, OceanConnectionStatus } from '@oceanprotocol/react'
import Table from '../atoms/Table'
import Price from '../atoms/Price'
import { fromWei } from 'web3-utils'
import DateCell from '../atoms/Table/DateCell'
import DdoLinkCell from '../atoms/Table/DdoLinkCell'

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
  const { account } = useWeb3()
  const { ocean, status } = useOcean()
  const [consumedList, setConsumedList] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function getConsumed() {
      if (!account || !ocean || status !== OceanConnectionStatus.CONNECTED)
        return

      setIsLoading(true)
      //  const consumedItems = await getConsumedList()

      // TODO: test this before updating react lib and after backend workd properly
      // const consumed = await ocean.assets.consumerAssets(accountId)
      // const consumedItemss = await Promise.all(
      //   consumed.map(async (did) => {
      //     const ddo = await ocean.assets.resolve(did)
      //     if (ddo) {
      //       // Since we are getting assets from chain there might be
      //       // assets from other marketplaces. So return only those assets
      //       // whose serviceEndpoint contains the configured Aquarius URI.
      //       const { serviceEndpoint } = ddo.findServiceByType('metadata')
      //       if (serviceEndpoint?.includes(config.aquariusUri as string)) return ddo
      //     }
      //   })

      // )
      // const consumedItems = (consumedItemss.filter(value => typeof value !== 'undefined')) as DDO[]
      // console.log('consumedss', consumedItems)

      // const data = consumedItems.map((ddo) => {
      //   const { attributes } = findServiceByType(ddo, 'metadata')
      //   const { name, price, datePublished } = attributes.main as MetaDataMain
      //   return {
      //     published: datePublished,
      //     name: name,
      //     price: price
      //   }
      // })
      const data = [
        { published: '2020-05-14T10:00:49Z', name: 'asdf', price: '0', id: 1 },
        { published: '2020-05-21T10:00:49Z', name: 'test', price: '0', id: 2 }
      ]
      setConsumedList(data)
      setIsLoading(false)
    }
    getConsumed()
  }, [account, ocean, status])

  return isLoading ? (
    <Loader />
  ) : account && ocean ? (
    <Table data={consumedList} columns={consumedColumns} />
  ) : (
    <div>Connect your wallet to see your consumed data sets.</div>
  )
}
