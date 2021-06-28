import React, { ReactElement, useEffect, useState } from 'react'
import Table from '../../atoms/Table'
import { gql, useQuery, OperationContext, OperationResult } from 'urql'
import Time from '../../atoms/Time'
import web3 from 'web3'
import AssetTitle from '../../molecules/AssetListTitle'
import { useWeb3 } from '../../../providers/Web3'
import axios from 'axios'
import { retrieveDDO } from '../../../utils/aquarius'
import { Logger } from '@oceanprotocol/lib'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { getOceanConfig } from '../../../utils/ocean'
import { getUrqlClientInstance } from '../../../providers/UrqlProvider'
import { useOcean } from '../../../providers/Ocean'

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

function getSubgrahUri(chainId: number): string {
  const config = getOceanConfig(chainId)
  console.log('CONFIG SG: ', config)
  return config.subgraphUri
}

export default function ComputeDownloads(): ReactElement {
  const { accountId } = useWeb3()
  // const { config } = useOcean()
  const { appConfig } = useSiteMetadata()
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState<DownloadedAssets[]>()
  const { chainIds } = useUserPreferences()
  const queryContext: OperationContext = {
    url: `${getSubgrahUri(1)}/subgraphs/name/oceanprotocol/ocean-subgraph`,
    requestPolicy: 'network-only'
  }

  const client = getUrqlClientInstance()

  const [result] = useQuery({
    query: getTokenOrders,
    variables: { user: accountId?.toLowerCase() },
    context: queryContext
  })

  console.log('RESULT: ', result)
  const { data } = result

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
  }, [appConfig.metadataCacheUri, result, chainIds])

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
