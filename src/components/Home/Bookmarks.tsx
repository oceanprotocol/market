import { useUserPreferences } from '@context/UserPreferences'
import React, { ReactElement, useEffect, useState, useCallback } from 'react'
import Table from '@shared/atoms/Table'
import { LoggerInstance } from '@oceanprotocol/lib'
import Price from '@shared/Price'
import Tooltip from '@shared/atoms/Tooltip'
import AssetTitle from '@shared/AssetList/AssetListTitle'
import { retrieveDDOListByDIDs } from '@utils/aquarius'
import { CancelToken } from 'axios'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import { useCancelToken } from '@hooks/useCancelToken'
import { AssetExtended } from 'src/@types/AssetExtended'
import { getAccessDetailsForAssets } from '@utils/accessDetailsAndPricing'
import { useWeb3 } from '@context/Web3'

const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: AssetExtended) {
      const { metadata } = row
      return <AssetTitle title={metadata.name} asset={row} />
    },
    maxWidth: '45rem',
    grow: 1
  },
  {
    name: 'Datatoken Symbol',
    selector: function getAssetRow(row: AssetExtended) {
      return (
        <Tooltip content={row.datatokens[0].name}>
          {row.datatokens[0].symbol}
        </Tooltip>
      )
    },
    maxWidth: '10rem'
  },
  {
    name: 'Price',
    selector: function getAssetRow(row: AssetExtended) {
      return <Price accessDetails={row.accessDetails} small />
    },
    right: true
  }
]

export default function Bookmarks(): ReactElement {
  const { appConfig } = useSiteMetadata()
  const { accountId } = useWeb3()
  const { bookmarks } = useUserPreferences()

  const [pinned, setPinned] = useState<AssetExtended[]>()
  const [isLoading, setIsLoading] = useState<boolean>()
  const { chainIds } = useUserPreferences()
  const newCancelToken = useCancelToken()

  const getAssetsBookmarked = useCallback(
    async (
      bookmarks: string[],
      chainIds: number[],
      cancelToken: CancelToken
    ) => {
      try {
        const result = await retrieveDDOListByDIDs(
          bookmarks,
          chainIds,
          cancelToken
        )
        return result
      } catch (error) {
        LoggerInstance.error(error.message)
      }
    },
    []
  )

  useEffect(() => {
    if (!appConfig?.metadataCacheUri || bookmarks === []) return

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
          newCancelToken()
        )
        const pinnedAssets: AssetExtended[] = await getAccessDetailsForAssets(
          resultPinned,
          accountId
        )
        setPinned(pinnedAssets)
      } catch (error) {
        LoggerInstance.error(error.message)
      }

      setIsLoading(false)
    }
    init()
  }, [
    appConfig?.metadataCacheUri,
    bookmarks,
    chainIds,
    accountId,
    getAssetsBookmarked,
    newCancelToken
  ])

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
