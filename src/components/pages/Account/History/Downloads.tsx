import React, { ReactElement, useEffect, useState } from 'react'
import Table from '../../../atoms/Table'
import { gql } from 'urql'
import Time from '../../../atoms/Time'
import web3 from 'web3'
import AssetTitle from '../../../molecules/AssetListTitle'
import { useWeb3 } from '../../../../providers/Web3'
import axios from 'axios'
import { retrieveDDO } from '../../../../utils/aquarius'
import { Logger } from '@oceanprotocol/lib'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import { fetchDataForMultipleChains } from '../../../../utils/subgraph'
import { OrdersData_tokenOrders as OrdersData } from '../../../../@types/apollo/OrdersData'
import NetworkName from '../../../atoms/NetworkName'

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
  timestamp: number
  networkId: number
}

const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: DownloadedAssets) {
      return <AssetTitle did={row.did} />
    }
  },
  {
    name: 'Network',
    selector: function getNetwork(row: DownloadedAssets) {
      return <NetworkName networkId={row.networkId} />
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
  const { appConfig } = useSiteMetadata()
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState<DownloadedAssets[]>()
  const { chainIds } = useUserPreferences()

  useEffect(() => {
    const variables = { user: accountId?.toLowerCase() }

    async function filterAssets() {
      const filteredOrders: DownloadedAssets[] = []
      const source = axios.CancelToken.source()
      try {
        setIsLoading(true)
        const response = await fetchDataForMultipleChains(
          getTokenOrders,
          variables,
          chainIds
        )

        const data: OrdersData[] = []
        for (let i = 0; i < response.length; i++) {
          response[i].tokenOrders.forEach((tokenOrder: OrdersData) => {
            data.push(tokenOrder)
          })
        }

        for (let i = 0; i < data.length; i++) {
          const did = web3.utils
            .toChecksumAddress(data[i].datatokenId.address)
            .replace('0x', 'did:op:')
          const ddo = await retrieveDDO(did, source.token)
          if (!ddo) continue
          if (ddo.service[1].type === 'access') {
            filteredOrders.push({
              did: did,
              networkId: ddo.chainId,
              dtSymbol: data[i].datatokenId.symbol,
              timestamp: data[i].timestamp
            })
          }
        }
        const sortedOrders = filteredOrders.sort(
          (a, b) => b.timestamp - a.timestamp
        )
        setOrders(sortedOrders)
      } catch (err) {
        Logger.log(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    filterAssets()
  }, [accountId, appConfig.metadataCacheUri, chainIds])

  return accountId ? (
    <Table
      columns={columns}
      data={orders}
      paginationPerPage={10}
      isLoading={isLoading}
    />
  ) : (
    <div>Please connect your Web3 wallet.</div>
  )
}
