import { useUserPreferences } from '../../providers/UserPreferences'
import React, { ReactElement, useEffect, useState } from 'react'
import Table from '../atoms/Table'
import { DDO, Logger, MetadataCache } from '@oceanprotocol/lib'
import { useOcean } from '@oceanprotocol/react'
import { Link } from 'gatsby'
import styles from './Bookmarks.module.css'
import Price from '../atoms/Price'

async function getAssetsBookmarked(pins: string[], metadataCacheUri: string) {
  try {
    const metadataCache = new MetadataCache(metadataCacheUri, Logger)
    const result: DDO[] = []

    for (const pin of pins) {
      result.push(await metadataCache.retrieveDDO(pin))
    }

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
        <h3 className={styles.title}>
          <Link to={`/asset/${row.id}`}>{attributes.main.name}</Link>
        </h3>
      )
    },
    grow: 2
  },
  {
    name: 'Price',
    selector: function getAssetRow(row: DDO) {
      return <Price ddo={row} small conversion />
    },
    right: true
  }
]

export default function Bookmarks(): ReactElement {
  const { config } = useOcean()
  const { bookmarks } = useUserPreferences()

  const [pinned, setPinned] = useState<DDO[]>()
  const [isLoading, setIsLoading] = useState<boolean>()

  const noBookmarks = !bookmarks || !bookmarks.length

  useEffect(() => {
    if (noBookmarks) return

    async function init() {
      setIsLoading(true)
      const resultPinned = await getAssetsBookmarked(
        bookmarks,
        config.metadataCacheUri
      )
      setPinned(resultPinned)
      setIsLoading(false)
    }
    init()
  }, [bookmarks, config.metadataCacheUri, noBookmarks])

  return noBookmarks ? (
    <div className={styles.empty}>Your bookmarks will appear here.</div>
  ) : (
    <Table columns={columns} data={pinned} isLoading={isLoading} noTableHead />
  )
}
