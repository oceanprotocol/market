import { useUserPreferences } from '../../providers/UserPreferences'
import React, { ReactElement, useEffect, useState } from 'react'
import Table from '../atoms/Table'
import { Logger } from '@oceanprotocol/lib'
import Price from '../atoms/Price'
import Tooltip from '../atoms/Tooltip'
import AssetTitle from './AssetListTitle'
import { getAssetsFromDidList } from '../../utils/aquarius'
import { getAssetsBestPrices, AssetListPrices } from '../../utils/subgraph'
import axios, { CancelToken } from 'axios'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'

async function getAssetsBookmarked(
  bookmarks: string[],
  chainIds: number[],
  cancelToken: CancelToken
) {
  try {
    const result = await getAssetsFromDidList(bookmarks, chainIds, cancelToken)
    return result
  } catch (error) {
    Logger.error(error.message)
  }
}

const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: AssetListPrices) {
      const { attributes } = row.ddo.findServiceByType('metadata')
      return <AssetTitle title={attributes.main.name} ddo={row.ddo} />
    },
    maxWidth: '45rem',
    grow: 1
  },
  {
    name: 'Datatoken Symbol',
    selector: function getAssetRow(row: AssetListPrices) {
      return (
        <Tooltip content={row.ddo.dataTokenInfo.name}>
          {row.ddo.dataTokenInfo.symbol}
        </Tooltip>
      )
    },
    maxWidth: '10rem'
  },
  {
    name: 'Price',
    selector: function getAssetRow(row: AssetListPrices) {
      return <Price price={row.price} small />
    },
    right: true
  }
]

export default function Bookmarks(): ReactElement {
  const { appConfig } = useSiteMetadata()
  const { bookmarks } = useUserPreferences()

  const [pinned, setPinned] = useState<AssetListPrices[]>()
  const [isLoading, setIsLoading] = useState<boolean>()
  const { chainIds } = useUserPreferences()

  useEffect(() => {
    if (!appConfig?.metadataCacheUri || bookmarks === []) return

    const source = axios.CancelToken.source()

    async function init() {
      if (!bookmarks?.length) {
        setPinned([])
        return
      }

      setIsLoading(true)

      try {
        const resultPinned = await getAssetsBookmarked(
          bookmarks,
          chainIds,
          source.token
        )
        const pinnedAssets: AssetListPrices[] = await getAssetsBestPrices(
          resultPinned?.results
        )
        setPinned(pinnedAssets)
      } catch (error) {
        Logger.error(error.message)
      }

      setIsLoading(false)
    }
    init()

    return () => {
      source.cancel()
    }
  }, [bookmarks, chainIds, appConfig?.metadataCacheUri])

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
