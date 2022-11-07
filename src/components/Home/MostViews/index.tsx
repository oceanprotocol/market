import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import styles from '../index.module.css'
import { useAbortController } from '@hooks/useAbortController'
import fetch from 'cross-fetch'
import {
  generateBaseQuery,
  getFilterTerm,
  queryMetadata
} from '@utils/aquarius'
import { useCancelToken } from '@hooks/useCancelToken'
import Tooltip from '@shared/atoms/Tooltip'
import Markdown from '@shared/Markdown'
import AssetList from '@shared/AssetList'
import { LoggerInstance } from '@oceanprotocol/lib'
import { sortAssets } from '@utils/index'

export default function MostViews(): ReactElement {
  const [loading, setLoading] = useState<boolean>()
  const [mostViewed, setMostViewed] = useState<AssetExtended[]>()
  const newCancelToken = useCancelToken()
  const newAbortController = useAbortController()

  const getMostViewed = useCallback(async () => {
    setLoading(true)
    try {
      const reponse = await fetch(
        'https://market-analytics.oceanprotocol.com/pages?limit=6',
        { signal: newAbortController() }
      )
      const views = (await reponse.json()) as PageViews[]
      const dids = views.map((x: PageViews) => x.did)
      const assetsWithViews: AssetExtended[] = []
      const baseParams = {
        esPaginationOptions: {
          size: 6
        },
        filters: [getFilterTerm('_id', dids)]
      } as BaseQueryParams
      const query = generateBaseQuery(baseParams)
      const result = await queryMetadata(query, newCancelToken())

      if (result?.totalResults > 0) {
        const sortedAssets = sortAssets(result.results, dids)
        const overflow = sortedAssets.length - 6
        sortedAssets.splice(sortedAssets.length - overflow, overflow)
        sortedAssets.forEach((asset) => {
          assetsWithViews.push({
            ...asset,
            views: views.filter((x) => x.did === asset.id)[0].count
          })
        })
        setMostViewed(assetsWithViews)
      }
    } catch (error) {
      LoggerInstance.error(error.message)
    }

    setLoading(false)
  }, [newAbortController, newCancelToken])

  useEffect(() => {
    getMostViewed()
  }, [getMostViewed])

  return (
    <section className={styles.section}>
      <h3>
        Most Views
        <Tooltip
          className={styles.info}
          content={
            <Markdown
              className={styles.note}
              text="Assets from all supported chains. It is not influenced by selected networks"
            />
          }
        />
      </h3>

      <AssetList
        assets={mostViewed}
        showPagination={false}
        isLoading={loading}
      />
    </section>
  )
}
