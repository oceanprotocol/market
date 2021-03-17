import { useUserPreferences } from '../../providers/UserPreferences'
import React, { ReactElement, useEffect, useState } from 'react'
import Table from '../atoms/Table'
import { DDO, Logger } from '@oceanprotocol/lib'
import { useOcean } from '../../providers/Ocean'
import Price from '../atoms/Price'
import Tooltip from '../atoms/Tooltip'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import AssetTitle from './AssetListTitle'
import { queryMetadata } from '../../utils/aquarius'
import axios, { CancelToken } from 'axios'

async function getAssetsBookmarked(
  bookmarks: string[],
  metadataCacheUri: string,
  cancelToken: CancelToken
) {
  const searchDids = JSON.stringify(bookmarks)
    .replace(/,/g, ' ')
    .replace(/"/g, '')
    .replace(/(\[|\])/g, '')
    // for whatever reason ddo.id is not searchable, so use ddo.dataToken instead
    .replace(/(did:op:)/g, '0x')

  const queryBookmarks = {
    page: 1,
    offset: 100,
    query: {
      nativeSearch: 1,
      query_string: {
        query: searchDids,
        fields: ['dataToken'],
        default_operator: 'OR'
      }
    },
    sort: { created: -1 }
  } as any

  try {
    const result = await queryMetadata(
      queryBookmarks,
      metadataCacheUri,
      cancelToken
    )

    return result
  } catch (error) {
    Logger.error(error.message)
  }
}

const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: DDO) {
      const { attributes } = row.findServiceByType('metadata')
      return <AssetTitle title={attributes.main.name} ddo={row} />
    },
    maxWidth: '45rem',
    grow: 1
  },
  {
    name: 'Datatoken Symbol',
    selector: function getAssetRow(row: DDO) {
      return (
        <Tooltip content={row.dataTokenInfo.name}>
          {row.dataTokenInfo.symbol}
        </Tooltip>
      )
    },
    maxWidth: '10rem'
  },
  {
    name: 'Price',
    selector: function getAssetRow(row: DDO) {
      return <Price price={row.price} small />
    },
    right: true
  }
]

export default function Bookmarks(): ReactElement {
  const { config } = useOcean()
  const { bookmarks } = useUserPreferences()

  const [pinned, setPinned] = useState<DDO[]>()
  const [isLoading, setIsLoading] = useState<boolean>()

  const networkName = (config as ConfigHelperConfig)?.network

  useEffect(() => {
    if (!config?.metadataCacheUri || !networkName || bookmarks === {}) return

    const source = axios.CancelToken.source()

    async function init() {
      if (!bookmarks[networkName]?.length) {
        setPinned([])
        return
      }

      setIsLoading(true)

      try {
        const resultPinned = await getAssetsBookmarked(
          bookmarks[networkName],
          config.metadataCacheUri,
          source.token
        )
        setPinned(resultPinned?.results)
      } catch (error) {
        Logger.error(error.message)
      }

      setIsLoading(false)
    }
    init()

    return () => {
      source.cancel()
    }
  }, [bookmarks, config.metadataCacheUri, networkName])

  return (
    <Table
      columns={columns}
      data={pinned}
      isLoading={isLoading}
      emptyMessage="Your bookmarks will appear here."
      noTableHead
    />
  )
}
