import React, { ReactElement, useEffect, useState } from 'react'
import Table from '../../atoms/Table'
import { gql, useQuery } from '@apollo/client'
import Time from '../../atoms/Time'
import web3 from 'web3'
import AssetTitle from '../../molecules/AssetListTitle'
import { useWeb3 } from '../../../providers/Web3'
import axios from 'axios'
import { retrieveDDO } from '../../../utils/aquarius'
import { Logger } from '@oceanprotocol/lib'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'

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

interface DownloadedAssets {
  did: string
  dtSymbol: string
  timestamp: string
}

const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: DownloadedAssets) {
      return <AssetTitle did={row.did} />
    }
  },
  {
    name: 'Datatoken',
    selector: function getTitleRow(row: DownloadedAssets) {
      return row.dtSymbol
    }
  },
  {
    name: 'Time',
    selector: function getTimeRow(row: DownloadedAssets) {
      return <Time date={row.timestamp.toString()} relative isUnix />
    }
  }
]

export default function ComputeDownloads(): ReactElement {
  const { accountId } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState<DownloadedAssets[]>()
  const { data } = useQuery(getTokenOrders, {
    variables: { user: accountId?.toLowerCase() }
  })
  const { appConfig } = useSiteMetadata()

  useEffect(() => {
    if (!appConfig.metadataCacheUri || !data) return

    async function filterAssets() {
      const filteredOrders: DownloadedAssets[] = []
      const source = axios.CancelToken.source()

      setIsLoading(true)
      try {
        for (let i = 0; i < data.tokenOrders.length; i++) {
          const did = web3.utils
            .toChecksumAddress(data.tokenOrders[i].datatokenId.address)
            .replace('0x', 'did:op:')
          const ddo = await retrieveDDO(
            did,
            appConfig.metadataCacheUri,
            source.token
          )
          if (ddo.service[1].type === 'access') {
            filteredOrders.push({
              did: did,
              dtSymbol: data.tokenOrders[i].datatokenId.symbol,
              timestamp: data.tokenOrders[i].timestamp
            })
          }
        }
        setOrders(filteredOrders)
      } catch (err) {
        Logger.log(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    filterAssets()
  }, [appConfig.metadataCacheUri, data])

  return (
    <Table
      columns={columns}
      data={orders}
      paginationPerPage={10}
      isLoading={isLoading}
      emptyMessage="Your downloads will show up here"
    />
  )
}
