import React, { useEffect, useState } from 'react'
import Loader from '../atoms/Loader'
import {
  useOcean,
  OceanConnectionStatus,
  useSearch,
  ComputeItem
} from '@oceanprotocol/react'

import Price from '../atoms/Price'
import { fromWei } from 'web3-utils'
import { findServiceByType } from '../../utils'
import Table from '../atoms/Table'
import Button from '../atoms/Button'
import { MetaDataMain, Logger } from '@oceanprotocol/squid'
import DateCell from '../atoms/Table/DateCell'
import DdoLinkCell from '../atoms/Table/DdoLinkCell'
import { config } from '../../config/ocean'
import shortid from 'shortid'
import ActionsCell from '../atoms/Table/ActionsCell'
import Tooltip from '../atoms/Tooltip'
import Tippy from '@tippyjs/react'
import JobDetailsDialog from '../molecules/JobDetailsDialog'

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
    selector: 'actions',
    cell: function getCell(row: any) {
      return (
        <ActionsCell handleOnClickViewJobDetails={row.onClickViewJobDetails} />
      )
    }
  }
]

export default function JobsList() {
  const { ocean, status, accountId } = useOcean()

  const [jobList, setJobList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userAgreed, setUserAgreed] = useState(false)
  const { getComputeItems } = useSearch()
  const [isOpen, setIsOpen] = useState(false)
  const [detailsComputeItem, setDetailsComputeItem] = useState<ComputeItem>()

  const onClickViewJobDetails = (compute: ComputeItem) => {
    setDetailsComputeItem(compute)
    setIsOpen(true)
  }
  const dialogClose = () => {
    setIsOpen(false)
  }

  const getJobs = async () => {
    if (!accountId || !ocean || status !== OceanConnectionStatus.CONNECTED)
      return
    setIsLoading(true)
    setUserAgreed(true)
    try {
      const computeItems = await getComputeItems()
      if (!computeItems) return
      const data = computeItems.map((item) => {
        const { attributes } = findServiceByType(item.ddo, 'metadata')
        const { name, price } = attributes.main as MetaDataMain
        return {
          dateCreated: item.job.dateCreated,
          dateFinished: item.job.dateFinished,
          status: item.job.statusText,
          name: name,
          price: price,
          did: item.ddo.id,
          id: shortid.generate(),
          onClickViewJobDetails: () => onClickViewJobDetails(item)
        }
      })

      setJobList(data)
      setIsLoading(false)
    } catch (err) {
      Logger.error(err)
      // TODO: no error handling
    } finally {
      setIsLoading(false)
    }
  }

  return isLoading ? (
    <Loader />
  ) : accountId && ocean ? (
    userAgreed ? (
      <>
        <JobDetailsDialog
          computeItem={detailsComputeItem}
          isOpen={isOpen}
          onClose={dialogClose}
        />
        <Table data={jobList} columns={columns} />
      </>
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
