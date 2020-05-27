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
import { MetaDataMain, Logger } from '@oceanprotocol/squid'
import DateCell from '../atoms/Table/DateCell'
import DdoLinkCell from '../atoms/Table/DdoLinkCell'
import { config } from '../../config/ocean'
import shortid from 'shortid'

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
  const { ocean, status, accountId, account } = useOcean()

  const [jobList, setJobList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userAgreed, setUserAgreed] = useState(false)
  const { getComputeItems } = useSearch()

  const getJobs = async () => {
    if (!accountId || !ocean || status !== OceanConnectionStatus.CONNECTED) return
    setIsLoading(true)
    setUserAgreed(true)
    try {
      

      const jobList = await ocean.compute.status(account)
      console.log(jobList)
      const computeItemss = await Promise.all(
        jobList.map(async (job) => {
          if (!job) return
          try {

            const { did } = await ocean.keeper.agreementStoreManager.getAgreement(
              job.agreementId
            )
            console.log(did)
            if(did==='0x0000000000000000000000000000000000000000000000000000000000000000') return
            const ddo = await ocean.assets.resolve(did)
            if (ddo) {
              
              // Since we are getting assets from chain there might be
              // assets from other marketplaces. So return only those assets
              // whose serviceEndpoint contains the configured Aquarius URI.
              const metadata = findServiceByType(ddo,'metadata')
              console.log(did,metadata)
              if(!metadata) return
              const { serviceEndpoint } = metadata
              if (serviceEndpoint?.includes(config.aquariusUri)) {
                return { job, ddo }
              }
            }
          }
          catch (err) {
            console.log(err)
          }

        })
      )

      const computeItems = computeItemss.filter(
        (value) =>  value !== undefined 
      ) as ComputeItem[] | undefined

     // const computeItems = await getComputeItems()
      console.log('compute items', computeItems)
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
          did: item.ddo.id,
          id: shortid.generate()
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
