import { useUserPreferences } from '../../providers/UserPreferences'
import React, { ReactElement, useEffect, useState } from 'react'
import Table from '../atoms/Table'
import { DDO, Logger, MetadataCache } from '@oceanprotocol/lib'
import { useOcean } from '@oceanprotocol/react'
import Price from '../atoms/Price'
import Tooltip from '../atoms/Tooltip'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import AssetTitle from './AssetListTitle'

async function getAssetsBookmarked(
  bookmarks: string[],
  metadataCacheUri: string
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
    const metadataCache = new MetadataCache(metadataCacheUri, Logger)
    const result = await metadataCache.queryMetadata(queryBookmarks)

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
      return (
        <AssetTitle
          title={attributes.main.name}
          did={row.id}
          owner={row.publicKey[0].owner}
        />
      )
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
      return <Price ddo={row} small />
    },
    right: true
  }
]

export default function Bookmarks(): ReactElement {
  const { config } = useOcean()
  const { bookmarks } = useUserPreferences()

  const [pinned, setPinned] = useState<DDO[]>()
  const [isLoading, setIsLoading] = useState<boolean>()

  useEffect(() => {
    if (!config?.metadataCacheUri || bookmarks === {}) return

    const networkName = (config as ConfigHelperConfig).network

    async function init() {
      if (!bookmarks[networkName]?.length) {
        setPinned([])
        return
      }

      setIsLoading(true)

      try {
        const resultPinned = await getAssetsBookmarked(
          bookmarks[networkName],
          config.metadataCacheUri
        )
        setPinned(resultPinned.results)
      } catch (error) {
        Logger.error(error.message)
      }

      setIsLoading(false)
    }
    init()
  }, [bookmarks, config.metadataCacheUri, config])

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
