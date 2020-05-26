import React, { useEffect, useState } from 'react'
import Loader from '../atoms/Loader'
import {
  useOcean,
  OceanConnectionStatus,
  useSearch,
  ComputeItem
} from '@oceanprotocol/react'
import Time from '../atoms/Time'
import Link from 'next/link'
import Price from '../atoms/Price'
import { fromWei } from 'web3-utils'
import { findServiceByType } from '../../utils'
import Table from '../atoms/Table'
import Button from '../atoms/Button'
import { MetaDataMain } from '@oceanprotocol/squid'
import DateCell from '../atoms/Table/DateCell'
import DdoLinkCell from '../atoms/Table/DdoLinkCell'

const columns = [
  {
    name: 'Created',
    selector: 'dateCreated',
    sortable: true,
    cell: function getCell(row: any) {
      return <DateCell date={row.dateCreated} />
    }
  },
  {
    name: 'Finished',
    selector: 'dateFinished',
    sortable: true,
    cell: function getCell(row: any) {
      return <DateCell date={row.dateFinished} />
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
  },
  {
    name: 'Status',
    selector: 'status'
  },
  {
    name: 'Actions',
    selector: 'actions'
  }
]

export default function JobsList() {
  const { ocean, status, account } = useOcean()

  const [jobList, setJobList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userAgreed, setUserAgreed] = useState(false)
  const { getComputeItems } = useSearch()

  const getJobs = async () => {
    if (!account || !ocean || status !== OceanConnectionStatus.CONNECTED) return
    setIsLoading(true)
    setUserAgreed(true)
    try {
      const computeItems = await getComputeItems()
      if (!computeItems) return
      const data = computeItems.map(item => {
        const { attributes } = findServiceByType(item.ddo, 'metadata')
        const { name, price } = attributes.main as MetaDataMain
        return {
          dateCreated: item.job.dateCreated,
          dateFinished: item.job.dateFinished,
          status: item.job.statusText,
          name: name,
          price: price,
          id: item.ddo.id
        }
      })

      setJobList(data)
      setIsLoading(false)
    } catch (err) {
      // TODO: no error handling
    } finally {
      setIsLoading(false)
    }
  }

  return isLoading ? (
    <Loader />
  ) : account && ocean ? (
    userAgreed ? (
      <Table data={jobList} columns={columns} />
    ) : (
      <>
        <div>
          <Button primary onClick={getJobs}>
            Sign to retrieve jobs
          </Button>
        </div>
      </>
    )
  ) : (
    <div>Connect your wallet to see your compute jobs.</div>
  )
}
