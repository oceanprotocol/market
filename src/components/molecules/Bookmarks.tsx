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
  const metadataCache = new MetadataCache(metadataCacheUri, Logger)
  const result: DDO[] = []

  for (const bookmark of bookmarks) {
    const ddo = bookmark && (await metadataCache.retrieveDDO(bookmark))
    ddo && result.push(ddo)
  }

  return result
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
        setPinned(resultPinned)
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
