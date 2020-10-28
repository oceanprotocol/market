import { useUserPreferences } from '../../providers/UserPreferences'
import React, { ReactElement, useEffect, useState } from 'react'
import Table from '../atoms/Table'
import { DDO, Logger, MetadataCache } from '@oceanprotocol/lib'
import { useOcean } from '@oceanprotocol/react'
import { Link } from 'gatsby'
import styles from './Pins.module.css'
import Price from '../atoms/Price'

async function getAssetsPinned(pins: string[], metadataCacheUri: string) {
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

export default function Pins(): ReactElement {
  const { config } = useOcean()
  const { pins } = useUserPreferences()

  const [pinned, setPinned] = useState<DDO[]>()
  const [isLoading, setIsLoading] = useState<boolean>()

  const noPins = !pins || !pins.length

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

  useEffect(() => {
    if (noPins) return

    async function init() {
      setIsLoading(true)
      const resultPinned = await getAssetsPinned(pins, config.metadataCacheUri)
      setPinned(resultPinned)
      setIsLoading(false)
    }
    init()
  }, [pins, config.metadataCacheUri, noPins])

  return noPins ? (
    <div className={styles.empty}>Your pinned data sets will appear here.</div>
  ) : (
    <Table columns={columns} data={pinned} isLoading={isLoading} noTableHead />
  )
}
